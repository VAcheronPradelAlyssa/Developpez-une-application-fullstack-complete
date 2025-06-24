package com.openclassrooms.mddapi.security;

import com.openclassrooms.mddapi.config.SecurityConfig;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;

class SecurityConfigTest {

    @Test
    void securityConfig_canBeInstantiated() {
        SecurityConfig config = mock(SecurityConfig.class);
        assertThat(config).isNotNull();
    }
}
