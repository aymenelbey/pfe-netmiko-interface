console.log('Client js loaded')
const loading = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
const table = $("#interfaces-table");
$(document).ready((e) => {
    console.log('Document ready');
    
    const loadIntefacesBtn = $("#btn-load-interfaces")

    $(loadIntefacesBtn).click((e) => {
        e.preventDefault();
        console.log('Fetching interfaces');
        $.ajax({
            method: 'GET',
            url: '/show-ip-int-br',
            contentType: 'application/json',
            beforeSend: () => {
                $(loadIntefacesBtn).html(loading).prop('disabled', true);
            },
            success: (res) => {
                $(table).find('tbody').html('');
                res.stdout.map((interface, index) => $(table).append(tableRow(interface, index)));
            },
            error: (err) => {},
            complete: () => {
                $(loadIntefacesBtn).text('Load interfaces').prop('disabled', false);
            }
        })
    })
})
$(document).delegate('.interface-ip', 'keyup', (e) => {
    if(e.which == 13){
        var input = $(e.target);
        var row = $(input).parents().eq(1);
        const interface = $(row).data('interface');
        const index = $(row).data('index');
        const data = {name: interface.name, ip: $(input).val()};

        $.ajax({
            method: 'POST',
            url: '/update-ip',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(data),
            beforeSend: () => {
                $(input).prop('disabled', true);
            },
            success: (res) => {
                $(table).find(`tr:nth-child(${index + 1})`).replaceWith(tableRow({...interface, ip: data.ip}, index));
            },
            error: (err) => console.log(err),
            complete: () => {
                $(input).prop('disabled', false);
            }
        });
    }
});
$(document).delegate('.updown', 'click', (e) => {
    e.preventDefault();
    const btn = $(e.target);
    const row = $(btn).parents().eq(1);
    const interface = $(row).data('interface');
    const index = $(row).data('index');
    const data = {name: interface.name, status: interface.up == 'up' ? 'shutdown' : 'no shutdown'};
    $.ajax({
        method: 'POST',
        url: '/interface-updown',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(data),
        beforeSend: () => {
            $(btn).html(loading).prop('disabled', true);
        },
        success: (res) => {
            $(table).find(`tr:nth-child(${index + 1})`).replaceWith(tableRow({...interface, up: interface.up == 'up' ? 'down' : 'up'}, index));
        },
        error: (err) => console.log(err),
        complete: () => ({})
    });
})
const tableRow = (interface, index) => {
    var row = $(`<tr data-index="${index}" data-interface='${JSON.stringify(interface)}'></tr>`);
    $(row).append(`<td>${index}</td>`);
    $(row).append(`<td>${interface.name}</td>`);
    $(row).append(`<td><input  class="form-control interface-ip" value="${interface.ip}"/></td>`);
    $(row).append(`<td>${interface.up}</td>`);
    $(row).append(`<td>${interface.protocol}</td>`);
    $(row).append(`<td><button class="btn updown btn-sm btn-${interface.up == 'up' ? 'danger' : 'success'}">Bring ${interface.up == 'up' ? 'DOWN' : 'UP'}</button></td>`);
    return row;
}