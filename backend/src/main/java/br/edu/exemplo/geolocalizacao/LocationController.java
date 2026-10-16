package br.edu.exemplo.geolocalizacao;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/locations")
@CrossOrigin // Permite que o exemplo Expo Web acesse a API local durante as aulas.
public class LocationController {
    private final LocationRepository repository;
    public LocationController(LocationRepository repository) { this.repository = repository; }

    @GetMapping
    public List<Location> list() { return repository.findAllByOrderByCreatedAtAscIdAsc(); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Location create(@Valid @RequestBody LocationRequest request) {
        return repository.save(new Location(request.name(), request.latitude(), request.longitude()));
    }
}
