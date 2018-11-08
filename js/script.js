var elem = '';
var poke_request = [];
var apiData = [];
var isHome = true;

let generateCard = function(data, isBackpack = 0) {
    let card = '';
    let removeBtn = '';
    let isCaptured = '';
    let type = [];
    let ability = [];
    let stats = [];
    let moves = [];
    for (let j = 0; j < data.types.length; j++) {
        type.push(data.types[j].type.name);
    }
    for (let j = 0; j < data.abilities.length; j++) {
        ability.push(data.abilities[j].ability.name);
    }
    for (let j = 0; j < data.moves.length; j++) {
        moves.push(data.moves[j].move.name);
    }
    for (let j = 0; j < data.stats.length; j++) {
        stats.push(data.stats[j].stat.name);
    }

    if (isBackpack) {
        removeBtn = `<a class="btn-floating btn waves-effect waves-light red darken-2 remove_backpack" 
                     title="Remove" data-id="${data.id}" data-name="${data.name}">
                     <i class="material-icons">close</i></a>`;
    } else {
        var captured = localStorage.getItem("captured_pokemon");
        if (captured && captured != "") {
            captured = captured.split(',');
            if (captured.indexOf(data.id.toString()) != -1) {   
                isCaptured = `<i class="small material-icons icon tooltipped" data-position="bottom" data-tooltip="Captured">
                              favorite_border</i>`;
            }
        }
    }

    card = `<div class="col-card element-item" data-name="${data.name}" data-weight="${data.weight}" data-height="${data.height}" data-experience="${data.base_experience}">
      <div class="card " data-category="1">
        <label class="checkbox_style">
            <input type="checkbox" class="checkbox" data-id="${data.id}" id="compare_${data.id}" />
            <span>Add to compare</span>
        </label>
        <div class="card-image card-pokemon-img">
            <img src="${data.sprites.front_default}" />
        </div>
        <div class="card-content">
            <p class="capital"><b>Name: ${data.name}</b></p>
            <p>Type: ${type.join(',')}</p>
            <p>Base Experience: ${data.base_experience}</p>
            <p>Height: ${data.height} dm</p>
            <p>Weight: ${data.weight} hg</p>
        </div>
        <div class="card-action">
            <button class="waves-effect waves-light btn more_detail_of_pokemon" 
                data-img=${data.sprites.front_default} 
                data-name=${data.name}
                data-height=${data.height}
                data-poketype=${type.join(',')}
                data-numpoketype=${type.length}
                data-ability=${ability.join(',')}
                data-numability=${ability.length}
                data-moves=${moves.join(',')}
                data-nummoves=${moves.length}
                data-stats=${stats.join(',')}
                data-numstats=${stats.length}
                data-weight=${data.weight}
                data-id=${data.id}
            >Detail</button>
            ${removeBtn}
            ${isCaptured}
        </div>
      </div>
    </div>`;
    return card;
}

let showLoader = function(t) {
    if (t) {
        $("#loader").show();
    } else {
        $("#loader").hide();
    }
}

// this function receive pokemon id and add it to backpack
let capturePokemon = function(id) {
    // local storage for data persistence
    var captured = localStorage.getItem("captured_pokemon");
    if (captured && captured != "") {
        captured = captured.split(",");
        captured.push(id);
        captured = captured.join(',');
        localStorage.setItem("captured_pokemon", captured);
    } else {
        localStorage.setItem("captured_pokemon", id);
    }
    M.toast({html: 'Hurray! Pokemon captured.', displayLength: 1500});
}

// this function receive pokemon id and remove it from backpack
let removePokemon = function(id) {
    let captured = localStorage.getItem('captured_pokemon');
    if (captured  && captured != "") {
        captured = captured.split(',');
        let index = captured.indexOf(id);
        captured.splice(index, 1);
        localStorage.setItem("captured_pokemon", captured);
        $("#show_backpack").trigger("click");
    }
}

let createComparison = function(data, num, captured) {
    let type = [];
    let ability = [];
    let stats = [];
    let moves = [];

    for (let j = 0; j < data.types.length; j++) {
        type.push(data.types[j].type.name);
    }
    for (let j = 0; j < data.abilities.length; j++) {
        ability.push(data.abilities[j].ability.name);
    }
    for (let j = 0; j < data.moves.length; j++) {
        moves.push(data.moves[j].move.name);
    }
    for (let j = 0; j < data.stats.length; j++) {
        stats.push(data.stats[j].stat.name);
    }

    $("#poke-img-"+num).attr("src", data.sprites.front_default);
    $("#poke-id-"+num).attr("data-id", data.id);
    $("#poke-name-"+num).html(data.name);
    $("#poke-height-"+num).html(data.height);
    $("#poke-weight-"+num).html(data.weight);
    $("#poke-type-"+num).html(type.join(','));
    $("#poke-numtype-"+num).html(type.length);
    $("#poke-ability-"+num).html(ability.join(','));
    $("#poke-numability-"+num).html(ability.length);
    $("#poke-moves-"+num).html(moves.join(','));
    $("#poke-nummoves-"+num).html(moves.length);
    $("#poke-stats-"+num).html(stats.join(','));
    $("#poke-numstats-"+num).html(stats.length);

    if (captured.indexOf(data.id.toString()) != -1) {
        $("#poke-id-"+num).attr("disabled", "disabled");
    } else {
        $("#poke-id-"+num).removeAttr("disabled");
    }
}

for(let i = 1; i < 100; i++) {
    poke_request.push($.ajax({
        url:  "https://pokeapi.co/api/v2/pokemon/"+i+"/",
        success: function(data) {
            apiData[data.id] = data;
        }
    }));
}

$.when.apply(undefined, poke_request).then(function(res) {
    showLoader(0);
    $('#show_home').trigger('click');
    $('.tooltipped').tooltip();
});


$(document).ready(function() {

    // init modal
    M.AutoInit();

    $("#backpack_conainer").hide();

    // showing modal for detail
    $("body").on("click", ".more_detail_of_pokemon", function() {
        let id = $(this).attr("data-id");
        $("#poke-img").attr("src", $(this).attr("data-img"));
        $("#current-pokemon-id").val(id);
        $("#poke-name").html($(this).attr("data-name"));
        $("#poke-height").html($(this).attr("data-height"));
        $("#poke-weight").html($(this).attr("data-weight"));
        $("#poke-type").html($(this).attr("data-poketype"));
        $("#poke-numtype").html($(this).attr("data-numpoketype"));
        $("#poke-ability").html($(this).attr("data-ability"));
        $("#poke-numability").html($(this).attr("data-numability"));
        $("#poke-moves").html($(this).attr("data-moves"));
        $("#poke-nummoves").html($(this).attr("data-nummoves"));
        $("#poke-stats").html($(this).attr("data-stats"));
        $("#poke-numstats").html($(this).attr("data-numstats"));

        var captured = localStorage.getItem("captured_pokemon");
        if (captured && captured != "") {
            captured = captured.split(',');
            if (captured.indexOf(id) != -1) {
                $(".capture_pokemon").attr("disabled","disabled");
            } else {
                $(".capture_pokemon").removeAttr("disabled");
            }
        }  else {
            $(".capture_pokemon").removeAttr("disabled");
        }

        $("#detailed_pokemon_container").modal('open'); 
    });

    // remove pokemon from backpack
    $("body").on("click", ".remove_backpack", function() {
        var id = $(this).attr("data-id");
        swal({
            text: "Are you sure to remove "+$(this).attr("data-name")+" ?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((res) => {
            if (res) {
                removePokemon(id);
                swal("Pokemon has been removed successfully!", {
                  icon: "success",
                });
            }
        });
    });

    $("#close_modal").click(function() {
        $("#detailed_pokemon_container").modal('close'); 
    });

    $("#show_backpack").click(function() {
        let backpack_elem = '';
        let backpack = localStorage.getItem("captured_pokemon");
        showLoader(1);
        if (backpack  && backpack != "") {
            backpack = backpack.split(',');
            for (var id of backpack) {
                backpack_elem += generateCard(apiData[id], 1);
            }
        } else {
            backpack_elem = "<h4>No pokemon in backpack.</h4>"
        }
        showLoader(0);
        $(this).siblings().removeClass("active");
        $(this).addClass("active");
        $("#backpack_conainer").html(backpack_elem);
        $("#backpack_conainer").show(400);
        $("#home_container").hide(400);
        isHome = false;
    });

    $("#show_home").click(function() {
        var elem = '';
        showLoader(1);
        for (var id in apiData) {
            elem += generateCard(apiData[id]);
        }
        showLoader(0);
        $("#home_container").html(elem);
        $(this).siblings().removeClass("active");
        $(this).addClass("active");
        if ($(".checkbox:checked").length == 2) {
            $("#show_comparison a").removeClass("disabled");
        } else {
            $("#show_comparison a").addClass("disabled");
        }
        $('.tooltipped').tooltip();
        $("#backpack_conainer").hide(400);
        $("#home_container").show(400);
        isHome = true;
    });

    $(".capture_pokemon").click(function() {
        capturePokemon($("#current-pokemon-id").val());
        $("#detailed_pokemon_container").modal('close');
        $("#show_home").trigger("click");
    });

    $(".capture_from_compare").click(function() {
        capturePokemon($(this).attr("data-id"));
        $(this).attr("disabled", "disabled");
        $("#show_home").trigger("click");
    });

    $("body").on("change", ".checkbox", function() {
        let total_checked = $(".checkbox:checked").length;
        $(".capture_from_compare").removeAttr("disabled");

        // selecting only two pokemon for compare
        if (total_checked == 2) {
            $("#show_comparison a").removeClass("disabled");
        } else {
            $("#show_comparison a").addClass("disabled");
            M.toast({html: 'Please choose 2 Pokemon.', displayLength: 1000});
        } 
    });

    $("#close_compare_modal").click(function() {
        $("#compare_pokemon_container").modal("close");
    });

    $("#show_comparison").click(function() {
        let total_checked = $(".checkbox:checked").length;
        if (total_checked == 2) {
            var compared_array = [];
            let captured = localStorage.getItem("captured_pokemon");
            if (captured  && captured != "") {
                captured = captured.split(',');
            }
            $(".checkbox:checked").each(function(index) {
                let i = index + 1;
                let data = apiData[$(this).attr("data-id")];
                createComparison(data, i, captured);
            });
            $("#compare_pokemon_container").modal("open");
        } else {
            M.toast({html: 'Please choose 2 Pokemon.', displayLength: 1000});
        }
    });

    $(".sorting_list").click(function() {
        $(".sorting_list").removeClass("active");
        $(this).addClass("active");
        var currentPage = (isHome == true) ? "#home_container" : "#backpack_conainer";

        var $grid = $(currentPage).isotope({
          itemSelector: '.element-item',
          masonry: {
            columnWidth: 205,
            gutter: 20
          },
          getSortData: {
            name: '[data-name]',
            height: '[data-height]',
            weight: '[data-weight]',
            experience: '[data-experience]',
          }
        });
        let sortValue = $(this).attr('data-filter');
        $grid.isotope({ sortBy: sortValue, sortAscending: true});

    });
});
