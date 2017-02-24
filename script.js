window.addEventListener("load", sidenVises);

function sidenVises() {
    console.log("Siden vises");

    // læs produktliste
    $.getJSON("http://petlatkea.dk/2017/dui/api/productlist?callback=?", visProduktListe);




    document.querySelector(".filterknap_vegetar").addEventListener("click", filterVegetar);

    //    document.querySelector(".filterknap_udsolgt").addEventListener("click", filterUdsolgt);

    document.querySelector(".filterknap_tilbud").addEventListener("click", filterTilbud);

    document.querySelector(".filterknap_alkohol").addEventListener("click", filterAlkohol);
}


// filterings function knapper Start

// function til filter produkterne
function filterVegetar(event) {
    console.log("Klik på vegetar-filter");

    // find alle ikke-vegetar-produkter
    var ikkeVegetarListe = document.querySelectorAll(".produkt:not(.vegetar)");

    // skjul dem - tilføj klassen "hide"
    ikkeVegetarListe.forEach(div => div.classList.toggle("hide"));

    event.preventDefault();
}

//function filterUdsolgt(event) {
//    console.log("Klik på udsolgt-filter");
//
//    // find alle ikke-vegetar-produkter
//    var ikkeUdsolgtListe = document.querySelectorAll(".produkt:not(.udsolgt)");
//
//    // skjul dem - tilføj klassen "hide"
//    ikkeUdsolgtListe.forEach(div => div.classList.toggle("hide"));
//
//    event.preventDefault();
//}

function filterTilbud(event) {
    console.log("Klik på Tilbud-filter");

    // find alle ikke-vegetar-produkter
    var tilbudsListe = document.querySelectorAll(".produkt:not(.tilbud)");

    // skjul dem - tilføj klassen "hide"
    tilbudsListe.forEach(div => div.classList.toggle("hide"));

    event.preventDefault();
}

function filterAlkohol(event) {
    console.log("Klik på alkohol-filter");

    // find alle ikke-vegetar-produkter
    var alkoholsListe = document.querySelectorAll(".produkt:not(.alkohol)");

    // skjul dem - tilføj klassen "hide"
    alkoholsListe.forEach(div => div.classList.toggle("hide"));

    event.preventDefault();
}

// filterings function knapper slut








function visProduktListe(listen) {
    console.table(listen);

    // TODO: filtrer udsolgte produkter fra ...
    listen = listen.filter(produkt =>
        !produkt.udsolgt);

    listen.forEach(visProdukt);
}



function visProdukt(produkt) {
    console.log(produkt);
    // klon produkt_template
    var klon = document.querySelector("#produkt_template").content.cloneNode(true);

    // insæt data i klon
    klon.querySelector(".data_navn").innerHTML = produkt.navn;
    klon.querySelector(".data_pris").innerHTML = produkt.pris;

    klon.querySelector(".data_kortbeskrivelse").innerHTML = produkt.kortbeskrivelse;


    var rabatpris = Math.ceil(produkt.pris - (produkt.pris * produkt.rabatsats / 100));
    klon.querySelector(".data_rabatpris").innerHTML = rabatpris;

    klon.querySelector(".data_billede").src = "/imgs/small/" + produkt.billede + "-sm.jpg";


    if (produkt.udsolgt == false) {
        // produkt er ikke udsolgt
        // udsolgttekst skal fjernes
        var udsolgttekst = klon.querySelector(".udsolgttekst");
        udsolgttekst.parentNode.removeChild(udsolgttekst);
    } else {
        klon.querySelector(".pris").classList.add("udsolgt");
    }

    if (produkt.udsolgt == true || produkt.rabatsats == 0) {
        // der er ikke rabat, rabat-prisen skal fjernes
        var rabatpris = klon.querySelector(".rabatpris");
        rabatpris.parentNode.removeChild(rabatpris);
    } else {
        klon.querySelector(".pris").classList.add("rabat");
    }

    // tilføj klasser til produkter
    if (produkt.vegetar == true) {
        klon.querySelector(".produkt").classList.add("vegetar");
    }

    if (produkt.udsolgt) {
        klon.querySelector(".produkt").classList.add("udsolgt");
    }

    if (produkt.rabatsats > 0) {
        klon.querySelector(".produkt").classList.add("tilbud");
    }

    if (produkt.alkoholprocent > 0) {
        klon.querySelector(".produkt").classList.add("alkohol");
    }


    //tilføj produkt-id til modalknap
    klon.querySelector(".modalknap").dataset.produkt = produkt.id;

    // registrer klik på modalknap
    klon.querySelector(".modalknap").addEventListener("click", modalKnapKlik)
        // append klon til .produkt_liste
    document.querySelector(".produktliste").appendChild(klon);


}





function modalKnapKlik(event) {
    console.log("knapklik", event);


    //find det produkt id, hvis knap der blev trykket på
    var produktId = event.target.dataset.produkt;
    console.log("klik på produkt", produktId);



    $.getJSON("http://petlatkea.dk/2017/dui/api/product?callback=?", {
        id: produktId
    }, visModalProdukt);
}




function visModalProdukt(produkt) {
    console.log("vis modal for ", produkt);

    //find modal template - klon den
    var klon = document.querySelector("#modal_template").content.cloneNode(true);

    // put data i klonen

    // lang beskrive af retterne
    klon.querySelector(".data_langbeskrivelse").innerHTML = produkt.langbeskrivelse;

    // rettens oprindelses land
    klon.querySelector(".data_oprindelsesregion").innerHTML = produkt.oprindelsesregion;

    // enentuelle allergier
    klon.querySelector(".data_allergener").innerHTML = produkt.allergener;

    // alkoholprocenten i retten
    klon.querySelector(".data_alkoholprocent").innerHTML = produkt.alkoholprocent;

    // antallet af stjerner
    klon.querySelector(".data_stjerner").innerHTML = produkt.stjerner;

    // rettens navn
    klon.querySelector(".data_navn").innerHTML = produkt.navn;



    klon.querySelector(".data_pris").innerHTML = produkt.pris;

    // rettens rabatstas
    var rabatpris = Math.ceil(produkt.pris - (produkt.pris * produkt.rabatsats / 100));
    klon.querySelector(".data_rabatpris").innerHTML = rabatpris;

    // rettens billede
    klon.querySelector(".data_billede").src = "/imgs/medium/" + produkt.billede + "-md.jpg";


    // rettens pris med og uden rabat
    if (produkt.udsolgt == true || produkt.rabatsats == 0) {
        // der er ikke rabat, rabat-prisen skal fjernes
        var rabatpris = klon.querySelector(".rabatpris");
        rabatpris.parentNode.removeChild(rabatpris);
    } else {
        klon.querySelector(".pris").classList.add("rabat");
    }

    // sletter det der stod i modal- content
    document.querySelector(".modal-content").innerHTML = "";

    // append klonen til modal-content
    document.querySelector(".modal-content").appendChild(klon);

}
