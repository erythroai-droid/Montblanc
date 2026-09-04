package com.montblanc.montblanc.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSessionDTO {
    private String name;
    private String login;
    private String email;
    private Boolean isAdmin;
    private Boolean authenticated;

    public UserSessionDTO(String name, String login) {
        this.name = name;
        this.login = login;
        this.email = null;
        this.isAdmin = false;
        this.authenticated = login != null;
    }
}
