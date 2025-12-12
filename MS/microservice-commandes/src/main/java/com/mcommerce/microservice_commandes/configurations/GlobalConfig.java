package com.mcommerce.microservice_commandes.configurations;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "mes-config-ms")
public class GlobalConfig {
    private int commandesLast;

    public int getCommandesLast() { return commandesLast; }
    public void setCommandesLast(int commandesLast) {
        this.commandesLast = commandesLast;
    }
}
