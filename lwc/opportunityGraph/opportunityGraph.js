import { LightningElement, wire } from 'lwc';
import ChartJs from '@salesforce/resourceUrl/ChartJs'
import {loadScript} from 'lightning/platformResourceLoader'
import getOpportunityWithAmount from '@salesforce/apex/OpportunityController.getOpportunityWithAmount' 

export default class OpportunityGraph extends LightningElement {

    isLoaded = false;
    chart
    oppList = []

    renderedCallback(){
        if(this.isLoaded) return
        this.isLoaded =true

        loadScript(this, ChartJs)
        .then(()=>{
            console.log('Chart is loaded')
        })

        .catch(error=>{
            console.log(error)
        })
    }

    @wire (getOpportunityWithAmount)
    wiredOpp({data, error}){
        if(data){
            /* name: Burling  Amount: 200000
               name: Edge  Amount: 76889
            */
            this.oppList = data
            this.drawChart()
        }

        if(error){
            console.error(error)
        }
    }

    drawChart(){
        const canvas = this.template.querySelector('canvas')
        const ctx = canvas.getContext('2d')

        this.chart = new window.Chart(ctx,{
            type:'bar',
            data:{
                labels:this.oppList.map(opp=> opp.Name),// ["Bulingto", "Edge Comm"]
                datasets:[{
                    label: "Opportunity Amount",
                    data: this.oppList.map(opp=> opp.Amount)
                }]
            }
        })

    }
}