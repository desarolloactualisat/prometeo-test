import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { SagaIterator } from "@redux-saga/core";
import { login as loginApi } from "../../helpers/auth/login";
// apicore
import { APICore, setAuthorization } from "../../helpers/api/apiCore";

// helpers
import {
  logout as logoutApi,
  signup as signupApi,
  forgotPassword as forgotPasswordApi,
} from "../../helpers/api/auth";

// actions
import { authApiResponseSuccess, authApiResponseError } from "./actions";

// constants
import { AuthActionTypes } from "./constants";

interface UserData {
  payload: {
    username: string;
    password: string;
    fullname: string;
    email: string;
  };
  type: string;
}

const api = new APICore();

/**
 * Login the user
 * @param {*} payload - email and password
 */

function* login({ payload: { email, password } }: UserData): SagaIterator {
  try {
    // yield put(authApiResponseSuccess(AuthActionTypes.LOGIN_USER, {email, password}));
    const data = yield call(loginApi, email, password);
    yield put(authApiResponseSuccess(AuthActionTypes.LOGIN_USER, data.user));
  } catch (error: any) {
    yield put(authApiResponseError(AuthActionTypes.LOGIN_USER, error.message));
  }
}

/**
 * Logout the user
 */
function* logout(): SagaIterator {
  try {
    yield call(logoutApi);
    api.setLoggedInUser(null);
    api.logout();
    yield put(authApiResponseSuccess(AuthActionTypes.LOGOUT_USER, {}));
  } catch (error: any) {
    yield put(authApiResponseError(AuthActionTypes.LOGOUT_USER, error));
  }
}

function* signup({
  payload: { fullname, email, password },
}: UserData): SagaIterator {
  try {
    const response = yield call(signupApi, { fullname, email, password });
    const user = response.data;
    // api.setLoggedInUser(user);
    // setAuthorization(user['token']);
    yield put(authApiResponseSuccess(AuthActionTypes.SIGNUP_USER, user));
  } catch (error: any) {
    yield put(authApiResponseError(AuthActionTypes.SIGNUP_USER, error));
    api.setLoggedInUser(null);
    setAuthorization(null);
  }
}

function* forgotPassword({ payload: { username } }: UserData): SagaIterator {
  try {
    const response = yield call(forgotPasswordApi, { username });
    yield put(
      authApiResponseSuccess(AuthActionTypes.FORGOT_PASSWORD, response.data)
    );
  } catch (error: any) {
    yield put(authApiResponseError(AuthActionTypes.FORGOT_PASSWORD, error));
  }
}
export function* watchLoginUser() {
  yield takeEvery(AuthActionTypes.LOGIN_USER, login);
}

export function* watchLogout() {
  yield takeEvery(AuthActionTypes.LOGOUT_USER, logout);
}

export function* watchSignup(): any {
  yield takeEvery(AuthActionTypes.SIGNUP_USER, signup);
}

export function* watchForgotPassword(): any {
  yield takeEvery(AuthActionTypes.FORGOT_PASSWORD, forgotPassword);
}

function* authSaga() {
  yield all([
    fork(watchLoginUser),
    fork(watchLogout),
    fork(watchSignup),
    fork(watchForgotPassword),
  ]);
}

export default authSaga;
