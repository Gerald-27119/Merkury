package com.merkury.vulcanus.exception.exceptions;

public class UserNotNativeException extends Exception{
    public UserNotNativeException(){
        super("Account was created using an external provider. To change your password, please do so through your original authentication provider.");
    }
}
