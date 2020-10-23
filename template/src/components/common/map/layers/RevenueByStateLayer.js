import { useSelector } from 'react-redux';
import { CartoSQLLayer } from '@deck.gl/carto';
import { getFilteredQuery } from '@carto/airship-api';
import { selectSourceById } from 'config/cartoSlice';
import { currencyFormatter } from 'utils/numberFormatters';

export const LayerStyle = {
  id: 'revenueByStateLayer',
  title: 'Total revenue',
  geomType: 'polygon',
  colors: {
    50000000: [215, 48, 39],
    1000000000: [255, 197, 116],
    1500000000: [26, 152, 80],
  },
  labels: {
    50000000: '< $50,000,000',
    1000000000: '$50,000,000 - $1,000,000,000',
    1500000000: '> $1,500,000,000',
  },
};

function getFillColor(f) {
  const colorScale = LayerStyle.colors;
  const keys = Object.keys(colorScale);
  let color = colorScale[keys[keys.length - 1]];
  for (let i = keys.length - 1; i >= 0; i--) {
    if (parseInt(f.properties.revenue) <= parseInt(keys[i])) {
      color = colorScale[keys[i]];
    } else {
      return color;
    }
  }
  return color;
}

export function RevenueByStateLayer() {
  const { revenueByStateLayer } = useSelector((state) => state.carto.layers);
  const source = useSelector((state) =>
    selectSourceById(state, revenueByStateLayer?.source)
  );

  if (revenueByStateLayer && source) {
    return new CartoSQLLayer({
      id: 'revenueByStateLayer',
      data: getFilteredQuery(source),
      credentials: source.credentials,
      getFillColor: getFillColor,
      getLineColor: [255, 255, 255],
      getLineWidth: 1,
      lineWidthMinPixels: 1,
      pickable: true,
      onHover: (info) => {
        if (info && info.object) {
          const formattedRevenue = currencyFormatter(info.object.properties.revenue);
          info.object = {
            html: `
              <strong>${info.object.properties.name}</strong><br>
              ${formattedRevenue[0]}${formattedRevenue[1]}
            `,
          };
        }
      },
    });
  }
}