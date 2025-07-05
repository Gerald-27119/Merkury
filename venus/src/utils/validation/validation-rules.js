export function isEmpty(value) {
    return value.trim().length === 0;
}

export function isEqualsToOtherValue(value, otherValue) {
    return value === otherValue;
}

export function isEmail(value) {
    return /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/.test(value);
}

export function isPassword(value) {
    return /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/.test(
        value,
    );
}

export function isUsername(value) {
    return /^[a-zA-Z0-9_]{3,16}$/.test(value);
}
