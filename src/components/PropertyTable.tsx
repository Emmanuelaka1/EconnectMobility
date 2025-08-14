import React from 'react';
import { MapPin, DollarSign, Calendar, Eye } from 'lucide-react';

interface Property {
  id: string;
  address: string;
  price: string;
  type: string;
  status: 'Available' | 'Sold' | 'Pending';
  dateAdded: string;
  views: number;
}

const PropertyTable: React.FC = () => {
  const properties: Property[] = [
    {
      id: '1',
      address: '1234 Sunset Boulevard, Hollywood',
      price: '$2,450,000',
      type: 'Villa',
      status: 'Available',
      dateAdded: '2024-01-15',
      views: 245
    },
    {
      id: '2',
      address: '567 Ocean Drive, Santa Monica',
      price: '$1,890,000',
      type: 'Condo',
      status: 'Pending',
      dateAdded: '2024-01-10',
      views: 189
    },
    {
      id: '3',
      address: '890 Beverly Hills Ave, Beverly Hills',
      price: '$3,200,000',
      type: 'Mansion',
      status: 'Sold',
      dateAdded: '2024-01-08',
      views: 412
    },
    {
      id: '4',
      address: '321 Rodeo Drive, Beverly Hills',
      price: '$5,750,000',
      type: 'Penthouse',
      status: 'Available',
      dateAdded: '2024-01-12',
      views: 567
    },
    {
      id: '5',
      address: '654 Malibu Coast, Malibu',
      price: '$4,100,000',
      type: 'Beach House',
      status: 'Available',
      dateAdded: '2024-01-14',
      views: 334
    }
  ];

  const getStatusBadge = (status: string) => {
    const classes = {
      Available: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
      Pending: 'bg-orange-100 text-orange-800 border border-orange-200',
      Sold: 'bg-gray-100 text-gray-800 border border-gray-200'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${classes[status as keyof typeof classes]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Recent Properties</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Added
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Views
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {properties.map((property, index) => (
              <tr key={property.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {property.type.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <p className="text-sm font-medium text-gray-800">{property.address}</p>
                      </div>
                      <p className="text-xs text-gray-500">{property.type}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-gray-800">{property.price}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(property.status)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{property.dateAdded}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-800">{property.views}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PropertyTable;