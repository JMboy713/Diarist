package com.hanium.diarist;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;


@EnableJpaAuditing
@SpringBootApplication
public class DiaristApplication {

    public static void main(String[] args) {

        SpringApplication.run(DiaristApplication.class, args);
    }

}
