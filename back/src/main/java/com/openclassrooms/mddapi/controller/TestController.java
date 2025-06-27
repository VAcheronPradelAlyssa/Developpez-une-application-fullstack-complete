package com.openclassrooms.mddapi.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

@RestController
@RequestMapping("/api/test")
public class TestController {
    @Autowired
    private DataSource dataSource;

    @PostMapping("/reset-db")
    public ResponseEntity<?> resetDb() throws SQLException {
        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement()) {
            stmt.execute("SET FOREIGN_KEY_CHECKS = 0");
            stmt.execute("TRUNCATE TABLE comment");
            stmt.execute("TRUNCATE TABLE subscription");
            stmt.execute("TRUNCATE TABLE post");
            stmt.execute("TRUNCATE TABLE subject");
            stmt.execute("TRUNCATE TABLE users");
            stmt.execute("SET FOREIGN_KEY_CHECKS = 1");
        }
        return ResponseEntity.ok().build();
    }
}