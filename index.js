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
    static url = 'https://662c176fde35f91de15a6f91.mockapi.io/planets'; //linking to our current mock API

    static getAllPlanets() {  //Loading full database
        return $.ajax({
            url: this.url,
            method: 'GET',
            dataType: 'json',
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.error('Error fetching planets:', textStatus, errorThrown);
        })
    }

    static getPlanet(id) { //returning an individual entry
        return $.get(this.url + `/${id}`);
    }

    static addPlanet(planet) { //adding a new entry
        return $.post(this.url, planet);
    }

    static updatePlanet(id, planet) { //changing a previously-established entry
        return $.ajax({
            url: this.url + `/${id}`,
            dataType: 'json',
            data: JSON.stringify(planet),
            contentType: 'application/json',
            type: 'PUT',
        });
    }

    static deletePlanet(id) { //removing an entry
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE',
        });
    }
}

//Setting up the DOM management
class DOMManager {
    static planets; //creating a planets object to work with

    static getAllPlanets() { //The PlanetLogs function for pulling all planets, ending with the render function to reload page
        PlanetLogs.getAllPlanets().then(planets => this.render(planets));
    }
    
    static deletePlanet(id) { //The PlanetLogs function for deleting an entry, ending with the render function to reload page
        PlanetLogs.deletePlanet(id)
            .then(() => {
                return PlanetLogs.getAllPlanets()
            })
            .then((planets) => this.render(planets));
    }

    static addPlanet(planet) { //The PlanetLogs function for adding an entry, ending with the render function to reload page
        PlanetLogs.addPlanet(planet)
        .then(() => {
            return PlanetLogs.getAllPlanets();
        })
        .then((planets) => this.render(planets));
    }

    static editPlanet(id) {
        //Toggle visibility of the editing fields for the given planet
        $(`#${id}-edit-fields`).toggle();
        //Populate editing fields with current values of the planet entry
        let planet = this.planets.find(p =>p._id === id);
        $(`#${id}-edit-description`).val(planet.description);
        $(`#${id}-edit-casualties`).val(planet.casualties);
        $(`#${id}-edit-danger`).val(planet.danger);
    }


    static updatePlanet(id) {
        // Fetching updated values from the DOM
        let description = $(`#${id}-edit-description`).val();
        let casualties = $(`#${id}-edit-casualties`).val();
        let danger = $(`#${id}-edit-danger`).val();
    
        // Creating an object with updated values
        let updatedPlanet = { description, casualties, danger };
    
        // Call the updatePlanet function using the new object, ending with the render function to reload page
        return PlanetLogs.updatePlanet(id, updatedPlanet)
            .then(() => {
                return PlanetLogs.getAllPlanets();
            })
            .then((planets) => this.render(planets));
    }
    

    //Actually loading in the data to the html
    static render(planets) {
        this.planets = planets;
        $('#storage').empty(); //Emptying screen first
        for (let planet of planets) { //looping through each stored entry, and creating html code for them to be displayed
            $('#storage').append(
                `<div id="${planet._id}" class="card">
                    <div class="card_header">
                        <h3>${planet.name}</h3>
                    </div>
                    <div class="card-body">
                        <div class="card">
                        <!-- First, the planetary information -->
                                <span class="border border-success"><p><strong>Planet Description: </strong> ${planet.description}</p></span>
                                <span class="border border-warning"><p><strong>Total Scout Casualties: </strong> ${planet.casualties}</p></span>
                                <span class="border border-success"><p><strong>The Dangers: </strong> ${planet.danger}</p></span>
                        </div>
                        <!-- Then, Edit fields that are hidden until the edit button is clicked -->
                        <div id="${planet._id}-edit-fields" style="display: none;">
                            <input type="text" id="${planet._id}-edit-description" class="form-control" placeholder="Planet Description">
                            <input type="number" id="${planet._id}-edit-casualties" class="form-control" placeholder="Total Casualties">
                            <input type="text" id="${planet._id}-edit-danger" class="form-control" placeholder="Dangerous Conditions">
                            <button class='btn btn-success' onclick='DOMManager.updatePlanet("${planet._id}")'>Save Updates</button>

                        </div>
                    </div>
                    <div class="card-footer">
                        <button class=' edit btn btn-warning' onclick='DOMManager.editPlanet("${planet._id}")'>Edit Planetary Record</button>
                        <button class='btn btn-danger' onclick='DOMManager.deletePlanet("${planet._id}")'>Remove Planetary Record</button>
                    </div>
                </div>
                `
            );
        }
    }

}

$('#new-planet-form').submit(function(event) { //linking the submit button for adding a new planet
    //Expecting custom results
    event.preventDefault();
    //Pull data from the form
    let name = $('#name').val();
    let description = $('#description').val();
    let casualties = $('#casualties').val();
    let danger = $('#danger').val();
    //Use data to create new Planet object
    let newPlanet = new Planet(name, description, casualties, danger);
    //Call addPlanet function using new object
    DOMManager.addPlanet(newPlanet);
    $('#name').val('');
    $('#description').val('');
    $('#casualties').val('');
    $('#danger').val('');

})


DOMManager.getAllPlanets(); //ensuring that the database will be loaded when the page pulls up.

