package br.edu.exemplo.geolocalizacao;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.TestPropertySource;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = "spring.datasource.url=jdbc:h2:mem:geotest;DB_CLOSE_DELAY=-1")
class LocationControllerTest {
    @Autowired MockMvc mvc;

    @Test void savesAndLoads() throws Exception {
        mvc.perform(post("/api/locations").contentType(MediaType.APPLICATION_JSON)
           .content("{\"name\":\"Teste\",\"latitude\":-23.5,\"longitude\":-47.45}"))
           .andExpect(status().isCreated())
           .andExpect(jsonPath("$.id").isNumber());
        mvc.perform(get("/api/locations"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$[0].latitude").value(-23.5));
    }

    @Test void rejectsInvalidCoordinates() throws Exception {
        mvc.perform(post("/api/locations").contentType(MediaType.APPLICATION_JSON)
           .content("{\"name\":\"Inválido\",\"latitude\":120,\"longitude\":-47.45}"))
           .andExpect(status().isBadRequest());
    }
}
