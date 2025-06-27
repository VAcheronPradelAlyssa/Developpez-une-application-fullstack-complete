package com.openclassrooms.mddapi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.mddapi.dto.PostCreateDTO;
import com.openclassrooms.mddapi.model.Post;
import com.openclassrooms.mddapi.model.Subject;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.PostRepository;
import com.openclassrooms.mddapi.repository.SubjectRepository;
import com.openclassrooms.mddapi.repository.UserRepository;
import com.openclassrooms.mddapi.util.JwtUtil;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import jakarta.servlet.http.Cookie;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class PostControllerIT {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private PostRepository postRepository;

    private User user;
    private Subject subject;
    private String token;

    @BeforeEach
    void setup() {
        postRepository.deleteAll();
        subjectRepository.deleteAll();
        userRepository.deleteAll();

        user = new User();
        user.setUsername("postuser");
        user.setEmail("postuser@test.com");
        user.setPassword("$2a$10$abcdefghijklmnopqrstuv"); // hash fictif
        user.setRole("USER");
        user = userRepository.save(user);

        subject = new Subject();
        subject.setName("SujetPost");
        subject.setDescription("desc");
        subject = subjectRepository.save(subject);

        token = JwtUtil.generateToken(user.getUsername(), user.getId());
    }

    @AfterEach
    void cleanup() {
        postRepository.deleteAll();
        subjectRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void createPost_shouldPersistAndReturnPost() throws Exception {
        PostCreateDTO dto = new PostCreateDTO();
        dto.setTitle("Titre post");
        dto.setContent("Contenu post");
        dto.setSubjectId(subject.getId());

        mockMvc.perform(post("/api/posts")
                .cookie(new Cookie("token", token))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.title").value("Titre post"))
            .andExpect(jsonPath("$.content").value("Contenu post"))
            .andExpect(jsonPath("$.authorUsername").value("postuser"))
            .andExpect(jsonPath("$.subjectName").value("SujetPost"));

        List<Post> posts = postRepository.findAll();
        assertThat(posts).hasSize(1);
        assertThat(posts.get(0).getTitle()).isEqualTo("Titre post");
    }

    @Test
    void getAllPosts_shouldReturnList() throws Exception {
        Post post = new Post();
        post.setTitle("Titre 1");
        post.setContent("Contenu 1");
        post.setAuthor(user);
        post.setSubject(subject);
        postRepository.save(post);

        mockMvc.perform(get("/api/posts")
                .cookie(new Cookie("token", token)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].title").value("Titre 1"));
    }

    @Test
    void getPostById_shouldReturnPost() throws Exception {
        Post post = new Post();
        post.setTitle("Titre unique");
        post.setContent("Contenu unique");
        post.setAuthor(user);
        post.setSubject(subject);
        post = postRepository.save(post);

        mockMvc.perform(get("/api/posts/" + post.getId())
                .cookie(new Cookie("token", token)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.title").value("Titre unique"));
    }

    @Test
    void getPostById_shouldReturn404IfNotFound() throws Exception {
        mockMvc.perform(get("/api/posts/99999")
                .cookie(new Cookie("token", token)))
            .andExpect(status().isNotFound());
    }
}
