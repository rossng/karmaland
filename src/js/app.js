App = {
    web3Provider: null,
    contracts: {},

    init: function () {
        // Load pets.
        /*$.getJSON('../pets.json', function (data) {
            var petsRow = $('#petsRow');
            var petTemplate = $('#petTemplate');

            for (i = 0; i < data.length; i++) {
                petTemplate.find('.panel-title').text(data[i].name);
                petTemplate.find('img').attr('src', data[i].picture);
                petTemplate.find('.pet-breed').text(data[i].breed);
                petTemplate.find('.pet-age').text(data[i].age);
                petTemplate.find('.pet-location').text(data[i].location);
                petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

                petsRow.append(petTemplate.html());
            }
        });*/

        return App.initWeb3();
    },

    initWeb3: function () {
        // Is there is an injected web3 instance?
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
        } else {
            // If no injected web3 instance is detected, fallback to the TestRPC.
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
        }
        web3 = new Web3(App.web3Provider);

        return App.initContract();
    },

    initContract: function () {
        $.getJSON('Karma.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract.
            var KarmaArtifact = data;
            App.contracts.Karma = TruffleContract(KarmaArtifact);

            // Set the provider for our contract.
            App.contracts.Karma.setProvider(App.web3Provider);

            // Use our contract to retrieve and mark the adopted pets.
            return App.getCitizens();
        });

        return App.bindEvents();
    },

    bindEvents: function () {
        //$(document).on('click', '.btn-adopt', App.handleAdopt);
        $(document).on('click', '.btn-add-citizen', App.addCitizen);
        $(document).on('click', '.btn-give-karma', App.giveKarma);
    },

    getCitizens: function (account) {
        App.contracts.Karma.deployed().then(function (instance) {
            karmaInstance = instance;
            return karmaInstance.getCitizens.call();
        }).then(function (citizens) {
            console.log(citizens);
            citizens.forEach(function (citizen) {
                console.log(citizen);
                $('form#list-citizens').append('<input type="radio" name="citizens" value="' + citizen + '" />' + citizen + '<br />');
                console.log(App.getKarma(citizen));
            });
        });
    },

    getKarma: function (citizenId) {
        var karma = 0;

        web3.eth.getAccounts(function (error, accounts) {
            if (error) {
                console.log(error);
            }

            var account = accounts[0];

            App.contracts.Karma.deployed().then(function (instance) {
                karmaInstance = instance;
                return karmaInstance.getKarma.call(citizenId);
            }).then(function (result) {
                console.log('Citizen ' + citizenId + ' has ' + result.c[0] + ' karma');
                $('form#list-citizens input[value="' + citizenId + '"]').after('<strong>' + result.c[0] + ' - </strong>');
                return result;
            }).catch(function (err) {
                console.log(err.message);
            });
        });
    },

    addCitizen: function () {
        event.preventDefault();

        var citizenId = $('#input-add-citizen').val();
        console.log('Adding citizen with address ' + citizenId);

        web3.eth.getAccounts(function (error, accounts) {
            if (error) {
                console.log(error);
            }

            var account = accounts[0];

            App.contracts.Karma.deployed().then(function (instance) {
                karmaInstance = instance;
                return karmaInstance.makeCitizen(citizenId, {from: account});
            }).then(function (result) {
                console.log('Added citizen with address ' + citizenId);
            }).catch(function (err) {
                console.log(err.message);
            });
        });
    },

    giveKarma: function() {
        event.preventDefault();

        var citizenId = $('input[name="citizens"]:checked').val();
        var amount = $('#input-give-karma').val();
        console.log('Sending ' + amount + ' karma to citizen with address ' + citizenId);

        web3.eth.getAccounts(function (error, accounts) {
            if (error) {
                console.log(error);
            }

            var account = accounts[0];

            App.contracts.Karma.deployed().then(function (instance) {
                karmaInstance = instance;
                return karmaInstance.transfer(citizenId, amount, {from: account});
            }).then(function (result) {
                console.log('Sent karma');
            }).catch(function (err) {
                console.log(err.message);
            });
        });
    },

    markAdopted: function (adopters, account) {
        var adoptionInstance;

        App.contracts.Adoption.deployed().then(function (instance) {
            adoptionInstance = instance;

            return adoptionInstance.getAdopters.call();
        }).then(function (adopters) {
            for (i = 0; i < adopters.length; i++) {
                if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
                    $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
                }
            }
        }).catch(function (err) {
            console.log(err.message);
        });
    },

    handleAdopt: function () {
        event.preventDefault();

        var petId = parseInt($(event.target).data('id'));

        var adoptionInstance;

        web3.eth.getAccounts(function (error, accounts) {
            if (error) {
                console.log(error);
            }

            var account = accounts[0];

            App.contracts.Adoption.deployed().then(function (instance) {
                adoptionInstance = instance;

                return adoptionInstance.adopt(petId, {from: account});
            }).then(function (result) {
                return App.markAdopted();
            }).catch(function (err) {
                console.log(err.message);
            });
        });
    }

};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
