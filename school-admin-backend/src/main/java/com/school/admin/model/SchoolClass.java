package com.school.admin.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "school_classes")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class SchoolClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "class_name", unique = true, nullable = false)
    private String className;

    @OneToMany(mappedBy = "schoolClass", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Section> sections;
}
