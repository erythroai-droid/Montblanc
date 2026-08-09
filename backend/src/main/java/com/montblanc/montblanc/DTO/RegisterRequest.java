package com.montblanc.montblanc.DTO;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String login;
    private String password;
}
