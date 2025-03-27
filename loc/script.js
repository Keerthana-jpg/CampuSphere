document.addEventListener("DOMContentLoaded", function () {
    let map = L.map('map', {
        crs: L.CRS.Simple, 
        minZoom: -2, 
        maxZoom: 2
    });

  
    let bounds = [[0, 0], [1000, 1000]];  
    L.imageOverlay('image/college-map.png', bounds).addTo(map);
    map.fitBounds(bounds);

    let markers = [];
    let locationsData = [];

   
    fetch('locations.json')
        .then(response => response.json())
        .then(locations => {
            locationsData = locations;
            locations.forEach(loc => {
                let marker = L.marker([loc.y, loc.x]) // Use x/y coordinates
                    .addTo(map)
                    .bindPopup(`<b>${loc.name}</b>`);
                markers.push({ marker, name: loc.name.toLowerCase(), coords: loc });
            });
        });


    document.getElementById("search-box").addEventListener("input", function () {
        let query = this.value.toLowerCase();
        markers.forEach(({ marker, name }) => {
            if (name.includes(query)) {
                marker.openPopup();
            }
        });
    });


    function calculateDistance(loc1, loc2) {
        let dx = loc2.x - loc1.x;
        let dy = loc2.y - loc1.y;
        return Math.sqrt(dx * dx + dy * dy).toFixed(2);
    }


    function moveMarker(marker, start, end, speed = 10) {
        let dx = (end.x - start.x) / speed;
        let dy = (end.y - start.y) / speed;
        
        let step = 0;
        let interval = setInterval(() => {
            if (step >= speed) {
                clearInterval(interval);
            } else {
                marker.setLatLng([start.y + dy * step, start.x + dx * step]);
                step++;
            }
        }, 100);
    }

    document.getElementById("navigate-btn").addEventListener("click", function () {
        let startName = document.getElementById("start-location").value.toLowerCase();
        let endName = document.getElementById("end-location").value.toLowerCase();

        let startLoc = locationsData.find(loc => loc.name.toLowerCase() === startName);
        let endLoc = locationsData.find(loc => loc.name.toLowerCase() === endName);

        if (startLoc && endLoc) {
            let distance = calculateDistance(startLoc, endLoc);
            alert(`Distance: ${distance} pixels`);

            let marker = L.marker([startLoc.y, startLoc.x]).addTo(map);
            moveMarker(marker, startLoc, endLoc);
        } else {
            alert("Invalid locations! Please select from the list.");
        }
    });
});
