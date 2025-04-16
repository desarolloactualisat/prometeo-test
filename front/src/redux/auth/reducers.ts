// apicore
import { APICore } from "../../helpers/api/apiCore";

// constants
import { AuthActionTypes } from "./constants";

const api = new APICore();

const INIT_STATE = {
  user: null,
  loading: false,
  error: null,
};

interface UserData {
  id: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  token: string;
}

// interface AuthActionType {
//   type:
//   | AuthActionTypes.API_RESPONSE_SUCCESS
//   | AuthActionTypes.API_RESPONSE_ERROR
//   | AuthActionTypes.LOGIN_USER
//   | AuthActionTypes.LOGOUT_USER
//   | AuthActionTypes.RESET;
//   payload: {
//     actionType?: string;
//     data?: UserData | {};
//     error?: string;
//   };
// }

interface State {
  user?: UserData | {};
  loading?: boolean;
  value?: boolean;
}

const Auth = (state = INIT_STATE, action: any) => {
  switch (action.type) {
    case AuthActionTypes.LOGIN_USER:
      return { ...state, loading: true, error: null };

    case AuthActionTypes.API_RESPONSE_SUCCESS:
      if (action.payload.actionType === AuthActionTypes.LOGIN_USER) {
        return { ...state, user: action.payload.data, loading: false };
      }
      return state;

    case AuthActionTypes.API_RESPONSE_ERROR:
      if (action.payload.actionType === AuthActionTypes.LOGIN_USER) {
        return { ...state, error: action.payload.error, loading: false };
      }
      return state;

    case AuthActionTypes.LOGOUT_USER:
      return {  ...state,
        user: null,
        userLoggedIn: false,
        loading: false,
        error: null, };

    default:
      return state;
  }
};

export default Auth;