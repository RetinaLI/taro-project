import { createAction } from 'redux-actions';
import { ASYNC_PROFILE_INFO } from '../constants/profile'

import profileService from "../../services/profile";

export const asyncProfileInfo = createAction(ASYNC_PROFILE_INFO, async () => {
  let result = await profileService.getCurrentUser();
  // console.info(result);
  if (!result || !result.nickName) result = null;

  let platform = null;
  if (result) {
    platform = result;
  }
  return {
    profile: result,
    platform: platform
  }
});
