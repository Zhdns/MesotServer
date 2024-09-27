export const enum CUSTOM_ERRORS {
    VALIDATION_ERROR = 'ValidationError',
    CAST_ERROR = 'CastError',
    SERVER_ERROR = 'Server error ;(',
    NO_USER_ERROR = 'User is not exist',
    NO_USER_OR_CARD_ERROR = 'User or Card is not exist',
    NO_PAGE = 'Page is not found',
    NO_PASSWORD = 'Password is not correct',
    INCCORECT_TOKEN = 'Token is inccorect or expired',
    NO_VALID_EMAIL = 'Email is invalid',
    NO_VALID_LINK = 'Link is not valid',
    USED_EMAIL = 'This email is already used',
    CARD_NOT_BELONG = 'This card belongs to someone else',
    SERVER_ERROR_RUS = 'На сервере произошла ошибка'
}

export const enum CUSTOM_VALIDATION_TEXT {
    LESS_THEN_MIN = 'Name must be at least 2 characters',
    MORE_THEN_MAX = 'Name must be less than 30 characters',
}

// eslint-disable-next-line no-useless-escape
export const urlRegex = /^(https?:\/\/)(www\.)?([a-zA-Z0-9-._~:/?#\[\]@!$&'()*+,;=]+)#?$/;
export const urlChecker = (url: string) => urlRegex.test(url);
export const DEFAULT_NAME = 'Harry Potter';
export const DEFAULT_ABOUT = 'Smart little wizsard';

export const enum ERROR_CODE {
    ER400 = 400,
    ER401 = 401,
    ER403 = 403,
    ER404 = 404,
    ER409 = 409,
    ER500 = 500,
}
