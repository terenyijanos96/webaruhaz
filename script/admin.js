import { adatBeolvas } from "./fetch.js";

let lista = [];

$(function () {
  let vegpont = "script/adatok.json";
  $(".admin-form-wrapper").html(adminFormLegeneralasa());
  adatBeolvas(vegpont, listaInicializalasa);

  $("#admin-article form").submit(function (e) {
    e.preventDefault();
    ujAlbumFelvitele(lista.albumok);
  });
});

function listaInicializalasa(data) {
  lista = data;
  tablazatLegeneralasa(lista.albumok);
}

function tablazatLegeneralasa(album_lista) {
  let thead = $("#admin-article thead");
  let tbody = $("#admin-article tbody");
  thead.html(tablazatFejlecLetrehozasa());
  tbody.html("");

  for (let i = 0; i < album_lista.length; i++) {
    tbody.append(adminTablazatLetrehozasaObjektumbol(album_lista[i]));
  }

  let gombok = $("thead button");
  for (let i = 0; i < gombok.length; i++) {
    const gomb = gombok[i];
    $(gomb).click(function () {
      rendezes(
        album_lista,
        gomb.attributes["orderby"].value,
        gomb.attributes["direction"].value
      );
      tablazatLegeneralasa(album_lista);
    });
  }
}

function tablazatFejlecLetrehozasa() {
  return `<tr>
              <th class="admin-table-id">
                <div class="admin-table-head-content">
                  <div class="admin-table-head-title">id</div>
                  <div class="sorting-button-group">
                    <button orderby="id" direction="asc" >&#x2C4;</button>
                    <button orderby="id" direction="desc">&#x2C5;</button>
                  </div>
                </div>
              </th>
              <th class="admin-table-cover">
                <div class="admin-table-head-content">
                  <div class="admin-table-head-title">Kép</div>
                </div>
              </th>
              <th class="admin-table-artist">
                <div class="admin-table-head-content">
                  <div class="admin-table-head-title">Előadó</div>
                  <div class="sorting-button-group">
                    <button orderby="eloado" direction="asc" >&#x2C4;</button>
                    <button orderby="eloado" direction="desc">&#x2C5;</button>
                  </div>
                </div>
              </th>
              <th class="admin-table-album">
                <div class="admin-table-head-content">
                  <div class="admin-table-head-title">Album</div>
                  <div class="sorting-button-group">
                    <button orderby="album" direction="asc" >&#x2C4;</button>
                    <button orderby="album" direction="desc">&#x2C5;</button>
                  </div>
                </div>
              </th>
              <th class="admin-table-genre">
                <div class="admin-table-head-content">
                  <div class="admin-table-head-title">Műfaj</div>
                  <div class="sorting-button-group">
                    <button orderby="mufaj" direction="asc" >&#x2C4;</button>
                    <button orderby="mufaj" direction="desc">&#x2C5;</button>
                  </div>
                </div>
              </th>
              <th class="admin-table-release">
                <div class="admin-table-head-content">
                  <div class="admin-table-head-title">Megjelenés</div>
                  <div class="sorting-button-group">
                    <button orderby="megjelenes" direction="asc" >&#x2C4;</button>
                    <button orderby="megjelenes" direction="desc">&#x2C5;</button>
                  </div>
                </div>
              </th>
              <th class="admin-table-price">
                <div class="admin-table-head-content">
                  <div class="admin-table-head-title">Ár (Ft)</div>
                  <div class="sorting-button-group">
                    <button orderby="ar" direction="asc" >&#x2C4;</button>
                    <button orderby="ar" direction="desc">&#x2C5;</button>
                  </div>
                </div>
              </th>
              <th class="admin-table-stock">
                <div class="admin-table-head-content">
                  <div class="admin-table-head-title">Készlet (db)</div>
                  <div class="sorting-button-group">
                    <button orderby="keszlet" direction="asc" >&#x2C4;</button>
                    <button orderby="keszlet" direction="desc">&#x2C5;</button>
                  </div>
                </div>
              </th>
              <th class="admin-table-songs">
              <div class="admin-table-head-content">
                <div class="admin-table-head-title">Dalok</div>
              </div>
            </th>
            </tr>
          `;
}

function adminTablazatLetrehozasaObjektumbol(obj) {
  let dal_lista_html = "";

  obj.dalok.forEach((dal) => {
    dal_lista_html += `<li>${dal}</li>`;
  });
  return `
      <tr>
        <td class="tablecell-id">${obj.id}</td>
        <td class="tablecell-img"><img src="${obj.boritokep}" alt="${obj.eloado}: ${obj.album}"></td>
        <td class="tablecell-artist">${obj.eloado}</td>
        <td class="tablecell-album">${obj.album}</td>
        <td class="tablecell-genre">${obj.mufaj}</td>
        <td class="tablecell-released">${obj.megjelenes}</td>
        <td class="tablecell-price">${obj.ar} Ft</td>
        <td class="tablecell-stock">${obj.keszlet} db</td>
        <td class="tablecell-songs">
          <ol class="songs-wrapper">
          ${dal_lista_html}
          </ol>
        </td>
      </tr>
    `;
}

function rendezes(lista, mezo, irany) {
  let szorzo = undefined;
  switch (irany) {
    case "asc":
      szorzo = 1;
      break;
    case "desc":
      szorzo = -1;
      break;
    default:
      szorzo = 0;
      break;
  }
  lista.sort((a, b) => {
    if (a[mezo] > b[mezo]) {
      return 1 * szorzo;
    }

    return -1 * szorzo;
  });
}

function ujAlbumFelvitele(album_lista) {
  let inputok = $("#admin-article form input:not(input[type='submit'])");
  let input_dalok = $("#admin-article form textarea");
  let obj = {};
  for (let i = 0; i < inputok.length; i++) {
    for (const key in album_lista[0]) {
      if (inputok[i].name === key) {
        let ertek = $(inputok[i]).val();
        if (inputok[i].type === "number") {
          ertek = parseInt(ertek);
        }
        obj[key] = ertek;
      }
    }
  }

  obj.id =
    "A" + (parseInt(album_lista[album_lista.length - 1].id.substring(1)) + 1);
  obj.dalok = input_dalok.val().split("\n");
  album_lista.push(obj);
  alert(`Új album hozzáadva! (${obj.eloado} - ${obj.album})`);
  tablazatLegeneralasa(album_lista);
}

function adminFormLegeneralasa() {
  return `
    <h2>Admin</h2>
    <form id="admin-form">
      <h3>Album hozzáadása</h3>
  
      <div class="input-group">
        <label for="input-cover">Borítókép URL hozzáadása</label>
        <input
          type="url"
          name="boritokep"
          id="input-cover"
          aria-label="Borítókép URL hozzáadása"
          pattern="^https?:\\/{2}[\\w\\.\\/]+\\.(jpg|jpeg|png|webp|gif)$"
          required
        />
      </div>
      <div class="input-group">
        <label for="input-artist">Előadó</label>
        <input
          type="text"
          id="input-artist"
          name="eloado"
          pattern="[\\wÁÉÍÓÖŐÚÜŰáéíóöőúüű]+( [\\wÁÉÍÓÖŐÚÜŰáéíóöőúüű]+)*"
          required
        />
      </div>
      <div class="input-group">
        <label for="input-album">Album</label>
        <input
          type="text"
          id="input-album"
          name="album"
          pattern="[\\wÁÉÍÓÖŐÚÜŰáéíóöőúüű]+( [\\wÁÉÍÓÖŐÚÜŰáéíóöőúüű]+)*"
          required
        />
      </div>
      <div class="input-group">
        <label for="input-genre">Műfaj</label>
        <input
          type="text"
          id="input-genre"
          name="mufaj"
          pattern="[\\wÁÉÍÓÖŐÚÜŰáéíóöőúüű\\-]+"
          required
        />
      </div>
      <div class="input-group">
        <label for="input-relase">Megjelenés éve</label>
        <input
          type="number"
          id="input-relase"
          min="1900"
          max="${new Date().getFullYear()}"
          value="1900"
          name="megjelenes"
          required
        />
      </div>
      <div class="input-group">
        <label for="input-price">Ár (Ft)</label>
        <input
          type="number"
          id="input-price"
          min="1"
          value="1"
          name="ar"
          required
        />
      </div>
      <div class="input-group">
        <label for="input-stock">Készlet (db)</label>
        <input
          type="number"
          id="input-stock"
          min="0"
          value="0"
          name="keszlet"
          required
        />
      </div>
      <label for="textarea-songs"
        >Dalok (külön dalok külön sorba kerüljenek!)</label
      >
      <textarea rows="12" id="textarea-songs" placeholder=""></textarea>
      <input
        type="submit"
        value="Felvitel"
        aria-label="Új album felvitele"
      />
    </form>`;
}
