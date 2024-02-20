import DitTog from './dit-tog.js';

const tableElement = document.querySelector('.departures');
const products = await (await fetch("js/products.json")).json();
const stations = await (await fetch("js/stations.json")).json();
const roskildeStation = new DitTog('RO');

roskildeStation.addEventListener('update', event => {
    console.log(event.detail);

    let output = '';

    event.detail.data.Trains.forEach(train => {

        const destination = stations.data.find(entry => entry.key === train.Routes[0].DestinationStationId)?.value;

        if (!destination) return;

        const isCancelled = train.IsCancelledDeparture;
        const product = products.data.find(entry => entry.product === train.Product);
        const labelClass = `departures__label--${product.label.toLowerCase().replace('+', '-plus')}`;
        const name = `${product.label} ${train.TrainId}`;
        const scheduled = train.ScheduleTimeDeparture.substring(11, 16);
        const delay = train.DelayTime.substring(11, 16);
        const trackOriginal = train.TrackOriginal;
        const trackCurrent = train.TrackCurrent;
        const trackIsChanged = trackOriginal !== null && trackOriginal !== trackCurrent;
        const track = `${isCancelled ? '-' : trackIsChanged ? `<s>${trackOriginal}</s> ${trackCurrent}` : trackCurrent}`;
        const information = [];
        const remark = event.detail.remarks.find(remark => remark.train_id === train.TrainId);
        const departure = isCancelled ? `<s>${scheduled}</s>` : delay === scheduled || train.DelayTime === '01-01-0001 00:00:00' ? scheduled : `<s>${scheduled}</s> ${delay}`;

        if (remark)         information.push({ icon: remark.icon, text: remark.text });
        if (trackIsChanged) information.push({ icon: 'emergency', text: `Kører fra spor ${trackCurrent}`});
        if (product.label === 'SJ' || product.label === 'SP') information.push({ icon: 'seat-reservation', text: 'Kræver SJ-billet'});
        if (isCancelled)    information.push({ icon: 'cancelled', text: 'Aflyst', color: 'var(--cancelled)'});

        output += `
        <tr class="departures__row${isCancelled ? ' departures__row--cancelled' : ''}">
            <td class="departures__cell"><div class="departures__label ${labelClass}">${name}</div></td>
            <td class="departures__cell">${departure}</td>
            <td class="departures__cell">${isCancelled ? `<s>${destination}</s>` : destination}</td>
            <td class="departures__cell">${track}</td>
            <td class="departures__cell">
            <ul class="departures__list"> 
            ${information.map((message, index) => {
                return `
                    <li class="departures__list-item">
                        <img class="departures__image" src="images/icons/${message.icon}.svg" alt="">
                        <div class="departures__information" ${message.color ? `style="color: ${message.color};"` : ''}>
                            <p${message.text.length > 40 ? ' class="departures__marquee"' : ''}">${message.text}</p>
                        </div>
                    </li>
                `
            })?.join('')}
            </ul>
            </td>
        </tr>
        `;
    });

    setInterval( () => {
        [...document.querySelectorAll('.departures__list')].forEach(list => {

            if (list.childNodes.length < 2) return;

            list.scrollTo({
                top: Math.floor(list.scrollHeight / list.children.length) + 1,
                behavior: 'smooth'
            });
            
            list.appendChild(list.childNodes[0]);
        })
    }, 7000);

    tableElement.tBodies[0].innerHTML = output;
});