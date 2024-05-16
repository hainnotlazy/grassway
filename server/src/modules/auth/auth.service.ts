import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from "uuid";
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { RedisService } from 'src/shared/services/redis/redis.service';
import { GithubProfile } from 'src/common/models/github-profile.model';
import { DownloadFileService } from 'src/shared/services/download-file/download-file.service';
import { GoogleProfile } from 'src/common/models/google-profile.model';
import { FacebookProfile } from 'src/common/models/facebook-profile.model';
import { TwitterProfile } from 'src/common/models/twitter-profile.model';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private redisService: RedisService,
    private downloadFileServer: DownloadFileService
  ) {}

  async validateLogin(username: string, password: string) {
    const user = await this.usersService.findUserByUsername(username);

    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }

    throw new BadRequestException("Username or password is incorrect");
  }

  async handleGithubAuthentication(githubProfile: GithubProfile) {
    const { id, username, fullname, github, avatar } = githubProfile;

    // Handle when user authenticating via github to link account
    if (id) {
      const userExisted = await this.usersService.findUser(id);

      if (!userExisted) {
        throw new NotFoundException("User not found");
      }

      await this.usersService.updateUserLinkedAccount(userExisted, "github", github);
      return null;
    }
    
    // Handle when user authenticating via github to login/register
    const userExisted = await this.usersService.findUserByThirdParty("github", github);

    // Login
    if (userExisted) {
      return userExisted;
    }
    
    // Register
    const avatarSaved = await this.downloadFileServer.downloadAvatar(avatar);
    const newUser = await this.usersService.createUser({
      username,
      password: uuidv4(),
      fullname,
      github,
      avatar: avatarSaved,
    })
    return newUser;
  }

  async handleGoogleAuthentication(googleProfile: GoogleProfile) {
    const { id, fullname, email, avatar } = googleProfile;

    // Handle when user authenticating via google to link account
    if (id) {
      return await this.linkAccountWithGoogle(id, email);
    }
    
    /** Handle when user authenticating via github to login/register 
     * - Handle login case: User login with email but email was taken by other user (email isn't verified)
    */ 
    const userExisted = await this.usersService.findUserByThirdParty("email", email);
    
    if (userExisted && userExisted.is_email_verified) {
      return userExisted;
    } else if (userExisted && !userExisted.is_email_verified) {
      userExisted.email = null;
      await this.usersService.saveUser(userExisted);
    }
    
    // Register
    const avatarSaved = await this.downloadFileServer.downloadAvatar(avatar);
    const newUser = await this.usersService.createUser({
      username: email,
      password: uuidv4(),
      fullname,
      email,
      is_email_verified: true,
      email_verification_code: null,
      avatar: avatarSaved,
    })
    return newUser;
  }

  async linkAccountWithGoogle(id: string, email: string) {
    const userExisted = await this.usersService.findUser(id);

    if (!userExisted) {
      throw new NotFoundException("User not found");
    }

    /**
     * Check if email was taken by other user
     * - Email was taken by other user (email is verified)
     * - Email was taken by other user (email isn't verified)
    */
    const user = await this.usersService.findUserByThirdParty("email", email);
    if (user && userExisted.id !== user.id && user.is_email_verified) {
      throw new BadRequestException("Email already linked with another account");
    } else if (user &&  userExisted.id !== user.id && !user.is_email_verified) {
      user.email = null;
      await this.usersService.saveUser(user);
    }

    await this.usersService.updateUserLinkedAccount(userExisted, "email", email);
    return null;
  }

  async handleFacebookAuthentication(facebookProfile: FacebookProfile) {
    const { id, fullname, facebookId, avatar } = facebookProfile;

    // Handle when user authenticating via facebook to link account
    if (id) {
      const userExisted = await this.usersService.findUser(id);

      if (!userExisted) {
        throw new NotFoundException("User not found");
      }

      await this.usersService.updateUserLinkedAccount(userExisted, "facebook", facebookId);
      return null;
    }

    // Handle when user authenticating via facebook to login/register    
    const userExisted = await this.usersService.findUserByThirdParty("facebook", facebookId);

    // Login
    if (userExisted) {
      return userExisted;
    }

    // Register
    const savedAvatar = await this.downloadFileServer.downloadAvatar(avatar);
    const newUser = await this.usersService.createUser({
      username: facebookId,
      password: uuidv4(),
      fullname,
      facebook: facebookId,
      avatar: savedAvatar
    })
    return newUser;
  }

  async handleTwitterAuthentication(twitterProfile: TwitterProfile) {
    const { id, username, fullname, twitterId, avatar } = twitterProfile;

    // Handle when user authenticating via facebook to link account
    if (id) {
      const userExisted = await this.usersService.findUser(id);

      if (!userExisted) {
        throw new NotFoundException("User not found");
      }

      await this.usersService.updateUserLinkedAccount(userExisted, "twitter", twitterId);
      return null;
    }

    // Handle when user authenticating via facebook to login/register    
    const userExisted = await this.usersService.findUserByThirdParty("twitter", twitterId);

    // Login
    if (userExisted) {
      return userExisted;
    }

    // Register
    const savedAvatar = await this.downloadFileServer.downloadAvatar(avatar);
    const newUser = await this.usersService.createUser({
      username,
      password: uuidv4(),
      fullname,
      twitter: twitterId,
      avatar: savedAvatar
    })
    return newUser;
  }

  async generateAccessToken(user: Partial<User>) {
    return this.jwtService.sign({
      userId: user.id,
      username: user.username,
      isActive: user.is_active
    })
  }

  async logout(currentUser: User, accessToken: string, tokenExpirationTime: number) {
    return this.redisService.setKey({
      key: accessToken,
      value: currentUser.id.toString(),
      expiresIn: this.getTimeLeft(tokenExpirationTime)
    })
  }

  async isTokenBlacklisted(accessToken: string) {
    return !!(await this.redisService.getKey({
      key: accessToken
    }));
  }

  private getTimeLeft(expirationTime: number) {
    const now = Math.floor(new Date().getTime() / 1000);

    return expirationTime > now ? expirationTime - now : 0;
  }
}
