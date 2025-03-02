package com.merkury.vulcanus;

import org.junit.jupiter.api.Test;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.stream.Stream;
import static org.junit.jupiter.api.Assertions.assertTrue;

class TestNamingConventionTest {

    @Test
    void testTestFilesNamingConvention() throws Exception {
        Path testDirectory = Paths.get("src/test");

        try (Stream<Path> paths = Files.walk(testDirectory)) {
            paths.filter(Files::isRegularFile)
                    .filter(path -> path.toString().endsWith(".java"))
                    .forEach(path -> {
                        String fileName = path.getFileName().toString();
                        String className = fileName.substring(0, fileName.lastIndexOf(".java"));
                        assertTrue(className.endsWith("Test"),
                                "File " + fileName + " does not end with word 'Test'");
                    });
        }
    }
}
