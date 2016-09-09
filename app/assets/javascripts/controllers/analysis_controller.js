(function(App) {

  'use strict';

  App.Controller = App.Controller || {};

  App.Controller.Analysis = App.Controller.Page.extend({

    index: function() {

      new App.View.Steps({el: '#slider'})

      $('#country').change(function() {
        if($(this).val() !== '') {
          $.get('/geo_locations/states_for/'+$(this).val());
        } else {
          $("#state-selection").addClass("hidden");
        }
      });
    },

    show: function(params) {
      var analysisModel = new App.Model.Analysis({
        id: params.id
      });

      var analysisActionsView = new App.View.AnalysisActions({
        el: '#analysisActions'
      });

      // Fetch the analysis before render the graphs
      analysisModel.fetch()
        .then(function(){
          var emissions_by_source = analysisModel.get('analysis').emissions_by_source;

          this.chart1 = new App.View.Chart({
            el: '#chart-1',
            options: {
              data: {
                json: emissions_by_source,
                keys: {
                  value: ['total']
                },
                type: 'bar'
              },
              bar: {
                width: {
                  ratio: 0.5 // this makes bar width 50% of length between ticks
                }
              },
              axis: {
                x: {
                  type: 'category',
                  categories: _.pluck(emissions_by_source, 'name')
                },
                y: {
                  tick: {
                    format: d3.format('s')
                  }
                }
              },
              legend: {
                show: false
              }
            }
          });

          // this.chart2 = new App.View.Chart({
          //   el: '#chart-2',
          //   options: {
          //     data: {
          //       columns: [
          //         ['Tillage', 30, 200],
          //         ['Fertilizer', 130, 100],
          //         ['Other Agrochemicals', 230, 200]
          //       ],
          //       type: 'bar',
          //       groups: [
          //         ['Tillage', 'Fertilizer', 'Other Agrochemicals']
          //       ]
          //     },
          //     bar: {
          //       width: {
          //         ratio: 0.5 // this makes bar width 50% of length between ticks
          //       }
          //     },
          //     axis: {
          //       x: {
          //         type: 'category',
          //         categories: ['t CO2/ha/yr', 'bushel/corn/yr']
          //       }
          //     },
          //     tooltip: {
          //       grouped: false
          //     },
          //     color: {
          //       pattern: ['#3f8c3f', '#2a5a3a', '#194b32']
          //     }
          //   }
          // });
        }.bind(this))
        .fail(function(){
          console.log('The API does not work');
        }.bind(this))

    },

  });


})(this.App);
