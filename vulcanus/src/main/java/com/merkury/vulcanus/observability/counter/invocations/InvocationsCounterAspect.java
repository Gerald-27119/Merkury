package com.merkury.vulcanus.observability.counter.invocations;

import lombok.RequiredArgsConstructor;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;

@Aspect
@Component
@RequiredArgsConstructor
public class InvocationsCounterAspect {

    private final InvocationsCounterService invocationsCounterService;

    @Before("execution(* *(..)) && @annotation(com.merkury.vulcanus.observability.counter.invocations.InvocationsCounter)")
    public void countMethodInvocation(JoinPoint joinPoint) {
        String methodName = joinPoint.getSignature().getName();
        invocationsCounterService.increment(methodName);
    }

    @Before("execution(* *(..)) && within(@com.merkury.vulcanus.observability.counter.invocations.InvocationsCounter *)")
    public void countClassInvocation(JoinPoint joinPoint) {
        Method method = ((MethodSignature) joinPoint.getSignature()).getMethod();
        String methodName = method.getDeclaringClass().getSimpleName() + "." + method.getName();
        invocationsCounterService.increment(methodName);
    }
}
