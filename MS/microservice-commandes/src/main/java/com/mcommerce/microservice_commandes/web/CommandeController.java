package com.mcommerce.microservice_commandes.web;

import com.mcommerce.microservice_commandes.model.Commande;
import com.mcommerce.microservice_commandes.model.Product;
import com.mcommerce.microservice_commandes.service.CommandeService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/commandes")
public class CommandeController {

    private final CommandeService service;

    public CommandeController(CommandeService service) {
        this.service = service;
    }

    @GetMapping
    public List<Commande> list() {
        return service.findAll();
    }

    @PostMapping
    public Commande save(@RequestBody Commande c) {
        c.setDate(LocalDate.now());
        return service.save(c);
    }

    @GetMapping("/{id}")
    public Commande get(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/{id}/produit")
    public Product getProduit(@PathVariable Long id) {

        Commande cmd = service.getById(id);

        if (cmd == null) {
            throw new RuntimeException("Commande introuvable");
        }

        if (cmd.getIdProduit() == null) {
            throw new RuntimeException("Aucun produit associé à cette commande");
        }

        return service.getProduit(cmd.getIdProduit());
    }

    @PutMapping("/{id}")
    public Commande update(@PathVariable Long id, @RequestBody Commande newCmd) {
        Commande cmd = service.getById(id);

        if (cmd == null) return null;

        cmd.setQuantite(newCmd.getQuantite());
        cmd.setDescription(newCmd.getDescription());
        cmd.setIdProduit(newCmd.getIdProduit());
        cmd.setMontant(newCmd.getMontant());

        return service.save(cmd);
    }


    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteById(id);
    }


}
