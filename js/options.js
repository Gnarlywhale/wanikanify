// An object that contains a dictionary of sheet collections.
// Each sheet collection contains a dictionary of sheets.
// Each sheet is an array 
var allImportedVocabDictionaries = {};
var public_spreadsheet_collection_key = "1lIo2calXb_GtaQCMLr989_Ma_hxXlxFsHE0egko-D9k";
var sheet_name = "6k Pt 1";
var delim = ";";
var to_column = "Kanji";
var from_column = "English";

// ------------------------------------------------------------------------------------------------
function add_black_list_item(value) {
    var $blackListTable = $('#blackListTable > tbody:last');
    $blackListTable.append('<tr><td><input type="text" class="input-xlarge"><button class="btn btn-danger pull-right removeBlackListItem" type="button">Remove Item</button></td></tr>');

    if (typeof value === 'string') {
        $('#blackListTable input:last').val(value);
    }

    $('.removeBlackListItem:last').click(function() {
            $(this).closest('tr').unbind().remove();
            return false;
    });
}

// ------------------------------------------------------------------------------------------------
function add_empty_google_spread_sheet_list_item(value) {
    // HACK: This is just to auto populate for dev's convenience for now.
    add_google_spread_sheet_list_item(
    public_spreadsheet_collection_key,
    from_column, delim, to_column, sheet_name);
}

// ------------------------------------------------------------------------------------------------
// Handler for when data has been grabbed from the Google Spreadsheet API.
function on_google_import(data, tabletop) {
    var importedVocabArray = [];
    
    // FIX: Should only be one? Probably need a for loop.
    var sheet_name = data[Object.keys(data)[0]].name;

    // Parse table data and dump into an array.
    // For each spreadsheet. (Just one, since we only do one at a time.)
    var sheets = tabletop.sheets(sheet_name).all();
    $.each(sheets, function(i, entry) {
        // Split up the english words by the delimiter (comma?).
        var splitEnglishWords = entry.English.split(delim);
        for (k = 0; k < splitEnglishWords.length; k++) {
            var eng_words = splitEnglishWords[k].trim();
            var jap_word = entry.Kanji.trim();
            if (eng_words.length == 0 || jap_word.length == 0)
                continue;
            var o = {eng: eng_words, jap: jap_word};
            importedVocabArray.push(o);
        }
    })
    
    // Dump array of data into the master dictionary.
    // Grab the spreadsheet object.
    var all_sheets = allImportedVocabDictionaries[public_spreadsheet_collection_key];
    if (!all_sheets) {
        // No entry for this spreadsheet.
        // Create an empty spreadsheet object.
        var sheets = {};
        allImportedVocabDictionaries[public_spreadsheet_collection_key] = sheets;
        all_sheets = allImportedVocabDictionaries[public_spreadsheet_collection_key];
    }
    // Add or replace vocab to this particular sheet.
    all_sheets[sheet_name] = importedVocabArray;

    console.log("Imported " + importedVocabArray.length + " from " + sheet_name +
                " in collection " + public_spreadsheet_collection_key);
}
        
// ------------------------------------------------------------------------------------------------
// spreadsheet_collection_key: The unique id for the spreadsheet collection (found in the url).
// sheet_name: A single spreadsheet name. A spreadsheet collection can have multiple sheets.
function add_google_spread_sheet_list_item(spreadsheet_collection_key,
                                           from_column,
                                           delim,
                                           to_column,
                                           sheet_name) {
    var $googleSpreadSheetListTable = $('#googleSpreadSheetListTable > tbody:last');
    $googleSpreadSheetListTable.append('<tr></tr>');
    // Grab the last row element.
    $row = $('#googleSpreadSheetListTable > tbody:last > tr:last');
    $row.append('<td><input type="text" class="input-medium" name="spreadsheet_key" placeholder="Spreadsheet key" value="' + public_spreadsheet_key + '"></td>');
    $row.append('<td><input type="text" class="input-medium" name="from_col_header" placeholder="From column header" value="' + from_column + '"></td>');
    $row.append('<td><input type="text" class="input-mini" name="delim" placeholder="Delimiter" value="' + delim + '"></td>');
    $row.append('<td><input type="text" class="input-medium" name="to_col_header" placeholder="To column header" value="' + to_column + '"></td>');
    $row.append('<td><input type="text" class="input-medium" name="sheet_name" placeholder="Sheet Name" value="' + sheet_name + '"></td>');
    $row.append('<td><button class="btn btn-success pull-right importGoogleSpreadSheetData" type="button">Import Data</button></td>');
    $row.append('<td><button class="btn btn-danger pull-right removeGoogleSpreadSheetListItem" type="button">Remove Item</button></td>');

    $('.removeGoogleSpreadSheetListItem:last').click(function() {
        var spreadsheet_collection_key = row.find('input[name=spreadsheet_key]').val();
        var sheet_name = row.find('input[name=sheet_name]').val();
        deleteCacheVocabList(spreadsheet_collection_key, sheet_name);
        $(this).closest('tr').unbind().remove();
        return false;
    });
    
    $('.importGoogleSpreadSheetData:last').click(function() {
        var row = $(this).closest('tr');
        //spreadsheet_collection_key = row.find('input[name=spreadsheet_key]').val();
        //sheet_name = row.find('input[name=sheet_name]').val();
        //delim = row.find('input[name=delim]').val();
        //to_column = row.find('input[name=to_col_header]').val();
        //from_column = row.find('input[name=from_col_header]').val();

        // TODO: Import one sheet at a time.
        // Imports the data.
        Tabletop.init( { key: spreadsheet_collection_key,
                         callback: on_google_import,
                         wanted: [sheet_name],
                         debug: true } );
        return true;
    });
}

// ------------------------------------------------------------------------------------------------
function deleteCacheVocabList(spreadsheet_collection_key, sheet_name)
{
    var spread_sheet = allImportedVocabDictionaries[spreadsheet_collection_key];
    delete spread_sheet[sheet_name];
    saveAllImported();
}

// ------------------------------------------------------------------------------------------------
function saveAllImported() {
    
    // TODO: Save spreadsheet key and stuff.
    // Save the google spreadsheet import settings.
    //$row.append('<td><input type="text" class="input-medium" name="spreadsheet_key" placeholder="Spreadsheet key" value="' + public_spreadsheet_key + '"></td>');
    //$row.append('<td><input type="text" class="input-medium" name="from_col_header" placeholder="From column header" value="' + from_column + '"></td>');
    //$row.append('<td><input type="text" class="input-mini" name="delim" placeholder="Delimiter" value="' + delim + '"></td>');
    //$row.append('<td><input type="text" class="input-medium" name="to_col_header" placeholder="To column header" value="' + to_column + '"></td>');
    //$row.append('<td><input type="text" class="input-medium" name="sheet_name" placeholder="Sheet Name" value="' + sheet_name + '"></td>');

    // Retrieve the entire list.
    //var googleSpreadSheetList = $('#googleSpreadSheetListTable input:text').map(function() {
    //    return $(this).val();
    //}).filter(function(index, value) {
    //    return value;
    //}).get();
    
    var obj = {};
    obj["wanikanify_googleVocabKey"] = {
        // Google spreadsheet import key
        //"googleSpreadsheetKey" : 
        // To column
        // Delimiter
        // From column
        // Map of data
        collections: allImportedVocabDictionaries
    };
    chrome.storage.local.set(obj, function(data) {
        console.log("Saved google data.");
        if(chrome.runtime.lastError)
        {
            console.log("Could not save google data.");
            return;
        }
    });
}

// ------------------------------------------------------------------------------------------------
function loadAllImported(items) {
    var data = items.wanikanify_googleVocabKey;
    if (!data) {
        console.log("No Google data to load.");
        return;
    }
    allImportedVocabDictionaries = data;
    console.log("Loaded Google data.");
}

// ------------------------------------------------------------------------------------------------
function save_options() {
    var apiKey = $("#apiKey").val();
    if (!apiKey) {
        $("#apiKeyControl").addClass("error");
        $(".alert-success").hide();
        $(".alert-error").show();
        return;
    }

    $("#apiKeyControl").removeClass("error");
    $(".alert-error").hide();

    chrome.storage.local.set({"wanikanify_apiKey":apiKey});

    var runOn = $('input:radio[name=runOn]:checked').val();
    chrome.storage.local.set({"wanikanify_runOn":runOn});

    var srs = $('input:checkbox[name=srs]:checked').map(function() {
        return this.value
    }).get();
    chrome.storage.local.set({"wanikanify_srs":srs});

    var blackList = $('#blackListTable input').map(function() {
        return $(this).val();
    }).filter(function(index, value) {
        return value;
    }).get();

    chrome.storage.local.set({"wanikanify_blackList":blackList});

    saveAllImported();
    
    // Save the custom vocab data.
    var customVocab = $("#customVocab").val();
    chrome.storage.local.set({"wanikanify_customvocab":customVocab});
}

// ------------------------------------------------------------------------------------------------
function restore_options() {
    chrome.storage.local.get([
        "wanikanify_apiKey",
        "wanikanify_runOn",
        "wanikanify_srs",
        "wanikanify_blackList",
        "wanikanify_customvocab",
        "wanikanify_googleVocabKey"],
        function(items) {
            var apiKey = items.wanikanify_apiKey;
            if (apiKey) {
                $("#apiKey").val(apiKey);
            }

            var runOn = items.wanikanify_runOn;
            if (runOn == "onUpdated") {
                $('#runOnUpdated').click();
            } else {
                $('#runOnClick').click();
            }
            var srs = items.wanikanify_srs;
            if (srs) {
                // clear everything
                $('input:checkbox[name=srs]:checked').each(function(index, item) {
                    $(item).prop("checked", false);
                });

                // set what needs to be set.
                $.each(srs, function(index, value) {
                    $("#"+value).prop("checked", true);
                });
            }
            var blackList = items.wanikanify_blackList;
            $.each(blackList, function(i, value) {
                add_black_list_item(value);
            });

            var customVocab = items.wanikanify_customvocab;
            if (customVocab) {
                $("#customVocab").val(customVocab);
            }
            
            loadAllImported(items);
        }
    );
}

// ------------------------------------------------------------------------------------------------
function clear_cache() {
    chrome.storage.local.remove("wanikanify_vocab");
    chrome.storage.local.remove("wanikanify_customvocab");
    // TODO: Clear the text box? Or maybe don't clear custom vocab?
    chrome.storage.local.remove("wanikanify_googleVocabKey");
    console.log("Cache cleared.");
    $(".alert-success").show();
}

// ------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', restore_options);
document.addEventListener('DOMContentLoaded', function() {
    $('#save').click(save_options);
    $('#clearCache').click(clear_cache);
    $('#addBlackListItem').click(add_black_list_item);
    $('#addGoogleSpreadSheetListItem').click(add_empty_google_spread_sheet_list_item);
});