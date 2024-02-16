import DitTog from './dit-tog.js';

const tableElement = document.querySelector('.departures');
const products = await (await fetch("js/products.json")).json();
const stations = await (await fetch("js/stations.json")).json();
const roskildeStation = new DitTog('RO');

roskildeStation.addEventListener('update', event => {
    console.log(event.detail);

    let output = '';

    event.detail.data.Trains.forEach(train => {

        const product = products.data.find(entry => entry.product === train.Product);
        const labelClass = `departures__label--${product.label.toLowerCase()}`;
        const name = `${product.label} ${train.TrainId}`;
        const scheduled = train.ScheduleTimeDeparture.substring(11, 16);
        const delay = train.DelayTime.substring(11, 16);
        const destination = stations.data.find(entry => entry.key === train.Routes[0].DestinationStationId)?.value;
        const track = train.TrackCurrent;
        const information = event.detail.remarks.find(remark => remark.train_id === train.TrainId);

        const departure = delay === scheduled || train.DelayTime === '01-01-0001 00:00:00' ? scheduled : `<s>${scheduled}</s> ${delay}`;

        if (!destination) return;

        //if (destination.)


        output += `
        <tr class="departures__row">
            <td class="departures__cell"><div class="departures__label ${labelClass}">${name}</div></td>
            <td class="departures__cell">${departure}</td>
            <td class="departures__cell">${destination}</td>
            <td class="departures__cell">${track}</td>
            <td class="departures__cell">
                

            ${information?.icon ? `<img class="departures__image" src="images/icons/${information.icon}.svg" alt="">` : ''}
                <div class="departures__information">
                    <div class="departures__marquee">${information?.text ?? ''}</div>
                </div>
            
            </td>
        </tr>
        `;
    });

    tableElement.tBodies[0].innerHTML = output;
});