var React = window.React = require('react'),
    mountNode = document.getElementById("app");

var MetroCardCalculator = React.createClass({
        updateInputs: function(value) {
            this.setState({
                amountOnCard: value.amount,
                farePrice: value.fare
            });
        },
        getInitialState: function() {
            return ({
                amountOnCard: 0,
                farePrice: 2.75
            });
        },
        render: function() {
            return <div><InputForm updateInputs = {this.updateInputs}/> <ComputationTable farePrice={this.state.farePrice} amountOnCard={this.state.amountOnCard}/></div>;
        }
    });

    var InputForm = React.createClass({
        handleChange: function() {
          var amount = this.refs.amountOnCard.getDOMNode().value;
          var fare = this.refs.farePrice.getDOMNode().value;
          this.props.updateInputs({amount: amount, fare: fare});
        },
        getDefaultProps: function () {
            return {
                defaultAmountOnCard: 0,
                defaultFarePrice: 2.75
            };
        },
        render: function () {
            return <div><form>
            <input defaultValue={this.props.defaultAmountOnCard} ref='amountOnCard' onChange={this.handleChange}/>
            <input defaultValue = {this.props.defaultFarePrice} ref = 'farePrice' onChange = {this.handleChange}/>
            </form></div>;
        }
    });

    var ComputationTable = React.createClass({
        calculateFareTableMock: function(amount, fare, bonus) {
            return([{add:0.10, total:2.75, rides:1},
                    {add:2.85, total:5.50, rides:2}]);
        },
        calculateFareTable: function(amount, fare, bonus) {
            var rows = [];
            var minAdd = (fare*2).toFixed(2);
            var minTotal = (amount*1 + fare*2*(1+bonus)).toFixed(2);
            var minRides = Math.floor(minTotal /
                fare);
            var minRemainder = (minTotal % fare).toFixed(2);
            for (var i = minRides; i < minRides + 20; i++) {
                var neededAdd = ((i * fare - amount) / (1 + bonus));
                var allowableAdd = (Math.ceil(neededAdd * 20) / 20 < 5.50 ? 5.50 : Math.ceil(neededAdd * 20) / 20).toFixed(2);

                var total = ((allowableAdd * (1 + bonus)) + amount * 1).toFixed(2);
                var rides = Math.floor(total / fare);
                var remainder = (total % fare).toFixed(2);

                rows.push({
                    rides: rides,
                    add: allowableAdd,
                    total: total,
                    remainder: remainder
                });
            }
            return (rows);
        },
        render: function() {
            var rows = this.calculateFareTable(this.props.amountOnCard, this.props.farePrice, .11);


            return ( < table className = "striped responsive-table" > < thead > < tr > < th > For this many rides < /th><th>Add this amount</th > < th > Leaving a remainder of < /th><th>Total Amount</th > < /tr></thead > < tbody > {
                    rows.map(function(row, i) {
                            return ( < tr key = {
                                i
                            } > < td > {
                                row.rides
                            } < /td ><td>{row.add}</td > < td > {
                                row.remainder
                            } < /td ><td>{row.total}</td > < /tr>
            );})}
            </tbody > < /table>);
        }
    });

React.render(<MetroCardCalculator /> , mountNode);
