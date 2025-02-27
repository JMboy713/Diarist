package com.hanium.diarist.domain.oauth.properties;

import lombok.Getter;
import lombok.NoArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

@Component
@Getter
@NoArgsConstructor
@PropertySource("classpath:application-oauth.yml")
public class KakaoProperties {

    @Value("${security.oauth2.client.registration.kakao.client-id}")
    private String clientId;
    @Value("${security.oauth2.client.registration.kakao.client-secret}")
    private String clientSecret;
    @Value("${security.oauth2.client.registration.kakao.rest-api-key}")
    private String restApiKey;
    @Value("${security.oauth2.client.registration.kakao.redirect-uri}")
    private String redirectUri;
    @Value("${security.oauth2.client.registration.kakao.admin-key}")
    private String adminKey;

    private String tokenUrl = "https://kauth.kakao.com/oauth/token";
    private String userInfoUrl = "https://kapi.kakao.com/v2/user/me";
    private String deleteAccountUrl = "https://kapi.kakao.com/v1/user/unlink";

}
