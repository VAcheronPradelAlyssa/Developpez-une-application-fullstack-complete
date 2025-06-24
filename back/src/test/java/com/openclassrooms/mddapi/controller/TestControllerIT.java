package com.openclassrooms.mddapi.controller;

import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.model.Subject;
import com.openclassrooms.mddapi.model.Post;
import com.openclassrooms.mddapi.model.Subscription;
import com.openclassrooms.mddapi.model.Comment;
import com.openclassrooms.mddapi.repository.UserRepository;
import com.openclassrooms.mddapi.repository.SubjectRepository;
import com.openclassrooms.mddapi.repository.PostRepository;
import com.openclassrooms.mddapi.repository.SubscriptionRepository;
import com.openclassrooms.mddapi.repository.CommentRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class TestControllerIT {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private PostRepository postRepository;
    @Autowired
    private SubscriptionRepository subscriptionRepository;
    @Autowired
    private CommentRepository commentRepository;

    @BeforeEach
    void setup() {
        // Ajoute des données pour vérifier le reset
        User user = new User();
        user.setUsername("resetuser");
        user.setEmail("resetuser@test.com");
        user.setPassword("pwd");
        user.setRole("USER");
        userRepository.save(user);

        Subject subject = new Subject();
        subject.setName("SujetReset");
        subject.setDescription("desc");
        subjectRepository.save(subject);

        Post post = new Post();
        post.setTitle("Titre");
        post.setContent("Contenu");
        post.setAuthor(user);
        post.setSubject(subject);
        postRepository.save(post);

        Subscription sub = new Subscription();
        sub.setUser(user);
        sub.setSubject(subject);
        sub.setSubscribedAt(java.time.LocalDateTime.now());
        subscriptionRepository.save(sub);

        Comment comment = new Comment();
        comment.setAuthor(user);
        comment.setPost(post);
        comment.setContent("coucou");
        comment.setCreatedAt(java.time.LocalDateTime.now());
        commentRepository.save(comment);
    }

    @AfterEach
    void cleanup() {
        commentRepository.deleteAll();
        subscriptionRepository.deleteAll();
        postRepository.deleteAll();
        subjectRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void resetDb_shouldTruncateAllTables() throws Exception {
        // Vérifie qu'il y a des données avant
        assertThat(userRepository.count()).isGreaterThan(0);
        assertThat(subjectRepository.count()).isGreaterThan(0);
        assertThat(postRepository.count()).isGreaterThan(0);
        assertThat(subscriptionRepository.count()).isGreaterThan(0);
        assertThat(commentRepository.count()).isGreaterThan(0);

        mockMvc.perform(post("/api/test/reset-db"))
            .andExpect(status().isOk());

        // Vérifie que tout est vidé
        assertThat(userRepository.count()).isZero();
        assertThat(subjectRepository.count()).isZero();
        assertThat(postRepository.count()).isZero();
        assertThat(subscriptionRepository.count()).isZero();
        assertThat(commentRepository.count()).isZero();
    }
}
