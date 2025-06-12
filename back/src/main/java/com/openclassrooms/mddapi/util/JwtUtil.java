package com.openclassrooms.mddapi.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.Key;

@Component
public class JwtUtil {

    private static String secretKey;

    @Value("${jwt.secret}")
    public void setSecretKey(String value) {
        JwtUtil.secretKey = value;
    }

    // Ajoute l'id utilisateur dans le token
    public static String generateToken(String username, Long userId) {
        Key key = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), SignatureAlgorithm.HS256.getJcaName());
        return Jwts.builder()
                .setSubject(username)
                .claim("userId", userId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24h
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public static byte[] getSecretKeyBytes() {
        return secretKey.getBytes(StandardCharsets.UTF_8);
    }
}