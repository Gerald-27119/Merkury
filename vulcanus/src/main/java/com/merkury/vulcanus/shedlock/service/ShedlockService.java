package com.merkury.vulcanus.shedlock.service;

import com.merkury.vulcanus.account.password.reset.token.PasswordResetToken;
import com.merkury.vulcanus.account.password.reset.token.PasswordResetTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ShedlockService {

    private final PasswordResetTokenRepository passwordResetTokenRepository;

    //jak sie nie da locka na krócej niż trwa rotacja schedulera to wywala błędy
    @Scheduled(cron = "0 */15 * * * *")
    @SchedulerLock(name = "cleanupExpiredTokens", lockAtMostFor = "29m", lockAtLeastFor = "14m")
    public void cleanupExpiredTokens() {
        LocalDateTime now = LocalDateTime.now();

        List<PasswordResetToken> expiredTokens = passwordResetTokenRepository.findAll()
                .stream()
                .filter(token -> token.getExpirationDate().isBefore(now))
                .toList();

        log.info("Cleaning up {} expired tokens", expiredTokens.size());
        passwordResetTokenRepository.deleteAll(expiredTokens);
        System.out.println("Deleting password reset tokens...");
    }
}
