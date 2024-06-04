class Sensor {
    constructor(id, name, type, value, unit, updated_at){
        if (type !== 'temperature' && type !== 'humidity' && type !== 'pressure') {
            throw new Error(`Tipo de sensor inválido: ${type}. Los tipos permitidos son temperature, humidity, pressure.`);
        }
        this.id = id;
        this.name = name;
        this.type = type;
        this.value = value;
        this.unit = unit;
        this.updated_at = updated_at;
    }


    updateValue(value){
        this.value = value
        this.updated_at = new Date();
    }
}

class SensorManager {
    constructor() {
        this.sensors = [];
    }

    addSensor(sensor) {
        this.sensors.push(sensor);
    }

    updateSensor(id) {
        const sensor = this.sensors.find((sensor) => sensor.id === id); //--Funciòn flecha: (sensor) => sensor.id === id //sensor representa la lista
        
        if (sensor) { 
            let newValue;
            switch (sensor.type) {
                case "temperatura": // Rango de -30 a 50 grados Celsius
                    newValue = (Math.random() * 80 - 30).toFixed(2);
                    break;
                case "humedad": // Rango de 0 a 100%
                    newValue = (Math.random() * 100).toFixed(2);
                    break;
                case "presion": // Rango de 960 a 1040 hPa (hectopascales o milibares)
                    newValue = (Math.random() * 80 + 960).toFixed(2);
                    break;
                default: // Valor por defecto si el tipo es desconocido
                    newValue = (Math.random() * 100).toFixed(2);
            }
            sensor.updateValue = newValue;
            this.render();
        } else {
            console.error(`Sensor ID ${id} no encontrado`);
        }
    }

    async loadSensors(url) {
        try{
            const response = await fetch(url);
            if (!response.ok) {
            throw new Error(`Error al cargar los sensores`);
        }
            const sensorData = await response.json();
            this.sensors = sensorData.map(sensor => new Sensor(
                sensor.id,
                sensor.name,
                sensor.type,
                sensor.value,
                sensor.unit,
                new Date(sensor.updated_at)
            ));
            this.render();
        }
        catch (error) {
            console.error(`Error al cargar los sensores: ${error.message}`);
        }
    

    }

    render() {
        const container = document.getElementById("sensor-container");
        container.innerHTML = "";
        this.sensors.forEach((sensor) => {
            const sensorCard = document.createElement("div");
            sensorCard.className = "column is-one-third";
            sensorCard.innerHTML = `
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title">
                            Sensor ID: ${sensor.id}
                        </p>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            <p>
                                <strong>Tipo:</strong> ${sensor.type}
                            </p>
                            <p>
                               <strong>Valor:</strong> 
                               ${sensor.value} ${sensor.unit}
                            </p>
                        </div>
                        <time datetime="${sensor.updated_at}">
                            Última actualización: ${new Date(
                                sensor.updated_at
                            ).toLocaleString()}
                        </time>
                    </div>
                    <footer class="card-footer">
                        <a href="#" class="card-footer-item update-button" data-id="${
                            sensor.id
                        }">Actualizar</a>
                    </footer>
                </div>
            `;
            container.appendChild(sensorCard);
        });

        const updateButtons = document.querySelectorAll(".update-button");
        updateButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                const sensorId = parseInt(button.getAttribute("data-id"));
                this.updateSensor(sensorId);
            });
        });
    }
}

const monitor = new SensorManager();

monitor.loadSensors("sensors.json");


//fx asincrona devuelve una promesa = un objeto de clase Promise = estado actual de una operaciòn.
//await hace que el programa se detenga y espere a que la promesa sea cumplida o rechazada.
//await solo puede ser usardo en fx asincronas.