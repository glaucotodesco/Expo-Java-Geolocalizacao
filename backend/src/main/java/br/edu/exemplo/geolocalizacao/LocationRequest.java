package br.edu.exemplo.geolocalizacao;

import jakarta.validation.constraints.*;
public record LocationRequest(
    @Size(max = 120) String name,
    @NotNull @DecimalMin("-90.0") @DecimalMax("90.0") Double latitude,
    @NotNull @DecimalMin("-180.0") @DecimalMax("180.0") Double longitude
) {}
