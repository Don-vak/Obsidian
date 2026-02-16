import React from 'react';
import { Clock, User, DollarSign, CheckCircle, XCircle, AlertCircle, ArrowRight } from 'lucide-react';

interface Activity {
    id: string;
    guest_name: string;
    created_at: string;
    status: string;
    total: number;
}

export function RecentActivity({ activities }: { activities: Activity[] }) {
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'confirmed': return <CheckCircle size={14} className="text-green-600" />;
            case 'cancelled': return <XCircle size={14} className="text-red-500" />;
            case 'pending': return <AlertCircle size={14} className="text-amber-500" />;
            default: return <Clock size={14} className="text-stone-400" />;
        }
    };

    const getActionText = (status: string) => {
        switch (status) {
            case 'confirmed': return 'booked a stay';
            case 'cancelled': return 'cancelled reservation';
            case 'pending': return 'started booking';
            default: return 'updated booking';
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                <div>
                    <h3 className="font-serif text-lg text-[#1C1917]">Recent Activity</h3>
                    <p className="text-xs text-stone-400 mt-1">Latest actions</p>
                </div>
                <button className="text-[#A18058] hover:text-[#8a6a4b] transition-colors p-2 rounded-full hover:bg-[#A18058]/5">
                    <ArrowRight size={18} />
                </button>
            </div>

            <div className="flex-1 p-0 relative">
                {activities.length === 0 ? (
                    <div className="p-8 text-center text-stone-400 text-sm">
                        No recent activity.
                    </div>
                ) : (
                    <div className="absolute left-6 top-6 bottom-6 w-px bg-stone-100 hidden sm:block"></div>
                )}

                <div className="space-y-0">
                    {activities.map((activity, index) => (
                        <div key={activity.id} className="p-4 sm:pl-12 relative hover:bg-stone-50 transition-colors group">
                            <div className="hidden sm:flex absolute left-6 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-stone-200 border-2 border-white ring-1 ring-stone-100 -ml-1 group-hover:bg-[#A18058] group-hover:ring-[#A18058]/30 transition-all"></div>

                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm text-[#1C1917]">
                                        <span className="font-medium">{activity.guest_name}</span>{' '}
                                        <span className="text-stone-500">{getActionText(activity.status)}</span>
                                    </p>
                                    <p className="text-xs text-stone-400 mt-1 flex items-center gap-1">
                                        <Clock size={10} />
                                        {new Date(activity.created_at).toLocaleString('en-US', {
                                            month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'
                                        })}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <span className="font-serif text-sm text-[#1C1917]">
                                        ${Number(activity.total).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
