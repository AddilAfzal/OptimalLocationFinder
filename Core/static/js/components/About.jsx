import React, {Fragment} from "react";
import {
    Header, Table,
} from 'semantic-ui-react'

const usage_source = [
    ['Commute information', "HereMaps Developer API", "https://developer.here.com/"],
    ['Restaurant locations and details', "Zomato API", "https://developers.zomato.com/api"],
    ['Health care service data', "CQC", "https://www.cqc.org.uk/file/179940"],
    ['Crime statistics', "Data.Police.UK API", "https://data.police.uk/docs/"],
    ['School/College locations', "GOV.UK", "https://www.compare-school-performance.service.gov.uk/"],
    ['Ofsted School ratings', "GOV.UK", "https://www.gov.uk/government/statistical-data-sets/monthly-management-information-ofsteds-school-inspections-outcomes"],
    ['Properties', "Zoopla API", "https://developer.zoopla.co.uk/"],
];
export default function About(props) {
    const bodyContents = usage_source.map((data) => (
          <Table.Row>
              <Table.Cell>
                  {data[0]}
              </Table.Cell>
              <Table.Cell>
                  {data[1]}
              </Table.Cell>
              <Table.Cell>
                  <a href={data[2]} target="_blank">{data[2]}</a>
              </Table.Cell>
          </Table.Row>
    ));
    return (
        <Fragment>
            <br/>
            <Header as="h3">About the project</Header>
            <p>
                This system was developed by Addil Afzal for their final year dissertation in Computer Science at <a href="https://city.ac.uk" target="_blank">City, University of London.</a> <br/>
                The aim of this project was to create a solution to simplify the home finding process, by gathering meaningful data into one place, thus minimizing the need to access multiple resources.
                Much inspiration was taken from existing home-finders, and previous publications in the area.
            </p>
            <Header as="h4">Sources of data</Header>

            <Table celled padded>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell singleLine>Usage</Table.HeaderCell>
                        <Table.HeaderCell>Source</Table.HeaderCell>
                        <Table.HeaderCell>URL</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                   <Table.Body>
                       {bodyContents}
                   </Table.Body>
             </Table>
        </Fragment>
    )
}