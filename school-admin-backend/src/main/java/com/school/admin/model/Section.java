package com.school.admin.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sections")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Section {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "class_id", nullable = false)
    @ToString.Exclude
    private SchoolClass schoolClass;
}
