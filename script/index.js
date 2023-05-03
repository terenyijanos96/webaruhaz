import {adatBeolvas} from './fetch.js'

let lista = [];

$(function(){
  let vegpont = "script/adatok.json";
  adatBeolvas(vegpont, listaInicializalasa);
})


function listaInicializalasa(data){
  lista = data;
  kartyakLegeneralasa(lista.albumok)
}

function kartyakLegeneralasa(album_lista) {
  let kartyak = $(".cards");
  for (let i = 0; i < album_lista.length; i++) {
    kartyak.append(kartyaLetrehozasaObjektumbol(album_lista[i]));
  }
  $(".cards button").click(function (e) {
    let modalDialog = $("dialog");
    $("body").css("overflow", "hidden");
    modalDialog[0].showModal();
    modalDialog.html(modalboxLetrehozasa(album_lista, e));

    $(".modalbox-header button").click(function () {
      $("body").css("overflow", "auto");
      modalDialog[0].close();
    });
  });
}

function kartyaLetrehozasaObjektumbol(obj) {
  return `
          <div class="card" id="${obj.id}">
            <img
              src="${obj.boritokep}"
              alt="${obj.eloado}: ${obj.album} borítóképe"
              draggable="false"
              width="300"
              height="300"
            />
            <h3 class="card-header">${obj.eloado} - ${obj.album}</h3>
            <table>
              <tr>
                <th>Előadó:</th>
                <td>${obj.eloado}</td>
              </tr>
              <tr>
                <th>Album:</th>
                <td>${obj.album}</td>
              </tr>
              <tr>
                <th>Műfaj:</th>
                <td>${obj.mufaj}</td>
              </tr>
              <tr>
                <th>Megjelenés:</th>
                <td>${obj.megjelenes}</td>
              </tr>
              <tr>
                <td colspan="2">
                  <button>Több információ</button>
                </td>
              </tr>
            </table>
            <div class="card-footer">
              <div class="price">Ár: ${obj.ar} Ft</div>
              <form class="cart">
                <input
                  type="number"
                  min="1"
                  value="${obj.keszlet <= 0 ? 0 : 1}"
                  max="${obj.keszlet}"
                  id="count"
                  aria-label="darabszám kiválasztása"
                  ${obj.keszlet <= 0 ? 'disabled = "true"' : ""}
                />
                <input 
                  type="submit" 
                  aria-label="kosárba rakás"
                  ${obj.keszlet <= 0 ? 'disabled = "true"' : ""} 
                  ${obj.keszlet <= 0 ? 'value="Elfogyott"' : 'value="Kosárba"'} 
                />
              </form>
            </div>
          </div>
          `;
}

function modalboxLetrehozasa(album_lista, e) {
  let target_id = $(e.target).parents("div.card").eq(0).attr("id")
  let card_index = -1
  
  album_lista.find((elem, index)=>{
    if(elem.id === target_id){
      card_index = index
      return 0
    }
  })
  
  let lista_txt = "";
  for (let item of album_lista[card_index].dalok) {
    lista_txt += `<li>${item}</li>`;
  }

  return `
  <div class="modalbox">
  <div class="modalbox-header">
    <h3>${album_lista[card_index].eloado} - ${album_lista[card_index].album}</h3>
    <button aria-label="Kilépés"></button>
  </div>
  
  <div class="modalbox-body">
    <div class="modalbox-image-contrainer">
      <img
        src="${album_lista[card_index].boritokep}"
        alt=""
      />
    </div>
    <div class="modalbox-album-content">
      <h4>Album információk</h4>
      <table>
        <tbody>
          <tr>
            <th>Előadó:</th>
            <td>${album_lista[card_index].eloado}</td>
          </tr>
          <tr>
            <th>Album:</th>
            <td>${album_lista[card_index].album}</td>
          </tr>
          <tr>
            <th>Műfaj:</th>
            <td>${album_lista[card_index].mufaj}</td>
          </tr>
          <tr>
            <th>Megjelenés:</th>
            <td>${album_lista[card_index].megjelenes}</td>
          </tr>
        </tbody>
      </table>
      <h4>Tracklist</h4>
      <ol>
        ${lista_txt}
      </ol>
    </div>     
    </div>
    <div class="modalbox-footer">
    <div class="modalbox-footer-stock">
    Készlet: ${album_lista[card_index].keszlet} db
    </div>
    </div>
    </div>
    `
 ;

}
