import { ASYNC_PROFILE_INFO } from '../constants/profile'

const INITIAL_STATE = {
  profile: null,
  platform: null
}

export function profile (state = INITIAL_STATE, action) {
  switch (action.type) {
    case ASYNC_PROFILE_INFO:
      return {
        ...state,
        profile: action.payload.profile,
        platform: action.payload.platform
      }
     default:
       return state
  }
}
