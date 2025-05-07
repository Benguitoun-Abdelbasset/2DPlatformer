package com._DPlatformer.model;


import com.mongodb.annotations.Sealed;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "users")
public class AppUser {


    @Id
    private String id;
    private String username;
    private String password;

}
