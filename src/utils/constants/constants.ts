const crypto = require('node:crypto');

export const userFields = 'name about avatar _id';
export const cardFields = 'createdAt likes name link owner _id';
export const ownerFields = 'name about avatar _id';

export const fields = {
  owner: 'owner',
  likes: 'likes',
};

export const defaultSecretKey = crypto.randomBytes(32).toString('hex');
export const CookieMaxAge = 3600000 * 24 * 7;
export const TokenMaxAge = '7d';
