package com.openclassrooms.mddapi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.mddapi.dto.CommentCreateDTO;
import com.openclassrooms.mddapi.dto.RegisterRequest;
import com.openclassrooms.mddapi.model.Comment;
import com.openclassrooms.mddapi.model.Post;
import com.openclassrooms.mddapi.model.Subject;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.CommentRepository;
import com.openclassrooms.mddapi.repository.PostRepository;
import com.openclassrooms.mddapi.repository.SubjectRepository;
import com.openclassrooms.mddapi.repository.UserRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import jakarta.servlet.http.Cookie;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Transactional
class CommentControllerIT {

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
    @Autowired
    private CommentRepository commentRepository;

    private String token;
    private User user;
    private Subject subject;
    private Post post;

    @BeforeEach
    void setup() throws Exception {
        // Nettoyage dans l'ordre inverse des dépendances
        commentRepository.deleteAll();
        postRepository.deleteAll();
        subjectRepository.deleteAll();
        userRepository.deleteAll();

        // Crée un utilisateur
        user = new User();
        user.setUsername("commentuser");
        user.setEmail("commentuser@test.com");
        user.setPassword("$2a$10$abcdefghijklmnopqrstuv"); // hash fictif
        user.setRole("USER");
        user = userRepository.save(user);

        // Crée un sujet
        subject = new Subject();
        subject.setName("SujetTest");
        subject.setDescription("desc");
        subject = subjectRepository.save(subject);

        // Crée un post
        post = new Post();
        post.setTitle("Titre");
        post.setContent("Contenu");
        post.setAuthor(user);
        post.setSubject(subject);
        post = postRepository.save(post);

        // Inscription + login pour récupérer le cookie token
        RegisterRequest reg = new RegisterRequest();
        reg.setUsername("commentuser2");
        reg.setEmail("commentuser2@test.com");
        reg.setPassword("Test1234!");
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reg)))
            .andExpect(status().isOk());

        var loginResp = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"emailOrUsername\":\"commentuser2@test.com\",\"password\":\"Test1234!\"}"))
            .andExpect(status().isOk())
            .andReturn().getResponse();

        token = loginResp.getCookie("token").getValue();
    }

    @AfterEach
    void cleanup() {
        // Nettoyage dans l'ordre inverse des dépendances
        commentRepository.deleteAll();
        postRepository.deleteAll();
        subjectRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void getCommentsByPost_shouldReturnEmptyInitially() throws Exception {
        mockMvc.perform(get("/api/posts/" + post.getId() + "/comments")
                .cookie(new Cookie("token", token)))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void addComment_shouldCreateAndReturnComment() throws Exception {
        CommentCreateDTO dto = new CommentCreateDTO();
        dto.setContent("Mon commentaire");

        mockMvc.perform(post("/api/posts/" + post.getId() + "/comments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto))
                .cookie(new Cookie("token", token)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content").value("Mon commentaire"));

        List<Comment> comments = commentRepository.findByPostId(post.getId());
        assertThat(comments).hasSize(1);
        assertThat(comments.get(0).getContent()).isEqualTo("Mon commentaire");
    }

    @Test
    void getCommentsByPost_shouldReturnCreatedComment() throws Exception {
        // Ajoute un commentaire
        Comment comment = new Comment();
        comment.setContent("Déjà là");
        comment.setAuthor(user);
        comment.setPost(post);
        commentRepository.save(comment);

        mockMvc.perform(get("/api/posts/" + post.getId() + "/comments")
                .cookie(new Cookie("token", token)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].content").value("Déjà là"));
    }
}
