package com.openclassrooms.mddapi.exception;

import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

class ApiExceptionHandlerTest {

    @Test
    void contextLoads() {}

    @Test
    void handleRuntimeException_shouldReturnBadRequestAndMessage() {
        ApiExceptionHandler handler = new ApiExceptionHandler();
        RuntimeException ex = new RuntimeException("Erreur testée");
        ResponseEntity<?> response = handler.handleRuntimeException(ex);

        assertThat(response.getStatusCode().value()).isEqualTo(400);
        assertThat(response.getBody()).isInstanceOf(java.util.Map.class);
        assertThat(((java.util.Map<?, ?>) response.getBody()).get("message")).isEqualTo("Erreur testée");
    }
}
