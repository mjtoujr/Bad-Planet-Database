
//First, defining the Planet object, with four traits, taken from the form
class Planet {
    constructor(name, description, casualties, danger) {
        this.name = name;
        this.description = description;
        this.casualties = casualties;
        this.danger = danger;
    }
}

//Setting up our methods for calling and modifying the database
class PlanetLogs {
    static url = '[PUT THE URL HERE]';

    static getAllPlanets() {
        return $.get(this.url);
    }

    static getPlanet(id) {
        return $.get(this.url + `/${id}`);
    }

    static addPlanet(planet) {
        return $.post(this.url, planet);
    }

    static updatePlanet(planet) {
        return $.ajax({
            url: this.url + `/${house._id}`,
            dataType: 'json',
            data: JSON.stringify(planet),
            contentType: 'application/json',
            type: 'PUT',
        });
    }

    static deletePlanet(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE',
        });
    }
}

//Setting up the DOM management
class DOMManager {
    static planets;

    static getAllPlanets() {
        PlanetLogs.getAllPlanets().then(planets => this.render(planets));
    }
    
    static render(planets) {
        this.planets = planets;
        $('#storage').empty();
        for (let planet of planets) {
            $('#app').append(
                `<div id="${house._id}" class="card">
                    <div class="card_header">
                        <h2>${planet.name}</h2>
                    </div>
                </div>
                `
            );
        }
    }

}

DOMManager.getAllHouses();