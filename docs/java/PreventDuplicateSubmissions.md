---
icon: edit
title: session+redis防止重复提交
category: Java
date: 2022-06-08
---

# 实现基于 session+redis 的防止重复提交

[🏍 🏍 🏍 🏍  gitee源码仓库🚀🚀🚀🚀](https://gitee.com/cps007/spring-boot-model)

## 定义注解

```java
package cn.springboot.model.base.annotation;

import java.lang.annotation.*;

/**
 * 自定义注解防止表单重复提交
 * @author jf
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
public @interface Submit {
    String prefix() default "prefix:";

    /**
     * 秒
     *
     * @return
     */
    long lockTime() default 10;
}


```

## 实现 aop 切面

[实现 aop 切面源码](https://gitee.com/cps007/spring-boot-model/blob/master/spring-boot-model-web/src/main/java/cn/springboot/model/web/aspectj/SubmitAspect.java)

```java
/**
 * 重复提交aop切面
 *
 * @author jf
 */
@Aspect
@Component
public class SubmitAspect {

    @Autowired
    private RedisUtils redisUtils;

    @Pointcut("execution(public * *(..)) && @annotation(cn.springboot.model.base.annotation.Submit)")
    public void submitPointCut() {
    }

    @Around("submitPointCut()")
    public Object interceptor(ProceedingJoinPoint joinPoint) throws Throwable {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        String sessionId = RequestContextHolder.getRequestAttributes().getSessionId();
        HttpServletRequest request = attributes.getRequest();

        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        Submit submit = method.getAnnotation(Submit.class);

        //设置key: prefix:sessionId-Path-method+参数
        String key = submit.prefix() + sessionId + ":" + request.getServletPath() + ":" + method.getName() + ":" + getArgs(joinPoint);

        if (StringUtils.isNotNull(key)) {
            //读取缓存
            if (redisUtils.string.get(key) != null) {
                Long expire = redisUtils.common.getExpire(key);
                String message = GlobalExceptionEnum.REPEAT_SUBMIT.getMessage();
                throw new GlobalException(GlobalExceptionEnum.REPEAT_SUBMIT.getCode(), message + "，请" + expire + "秒后重试！");
            }
            // 如果是第一次请求,就将key存入缓存中
            redisUtils.string.set(key, key, submit.lockTime());
        }
        return joinPoint.proceed();
    }

    private String getArgs(ProceedingJoinPoint joinPoint) {
        Object[] args = joinPoint.getArgs();
        boolean argsStatus = StringUtils.isNotNull(args);

        if (argsStatus) {
            StringBuilder data = new StringBuilder();
            for (Object o : Arrays.stream(args).toArray()) {
                data.append(o);
            }
            return data.toString();
        }
        return "";
    }

}


```

