package com.mcommerce.microservice_commandes.web;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RefreshScope
public class ConfigController {

    @Value("${mes-config-ms.commandes-last}")
    private int lastDays;

    @GetMapping("/config")
    public int config() {
        return lastDays;
    }
}
